import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { constants } from "./developLiveGame/constants";
import { GameFacade } from "./developLiveGame/gameFacade";
import { ContextVars } from "./globals";
import { sleep } from "./utils";

/**
 * ゲーム開発をシューティングゲームに模したミニゲーム.
 *
 * 障壁 (Obstacle) が随時発生. 対処に時間がかかるとダメージ.
 * やる気を出して根性 (Shooter による Attacker 射出) で障壁をつぶす.
 */
export class DevelopLiveGame extends LiveGame {
	private gameFacade: GameFacade;

	protected override handleIntroduction({ scene, container, vars }: LiveContext, next: () => void): (() => void) | void {
		const contextVars = vars as ContextVars;
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "khaki",
			opacity: 0.5
		}));
		this.gameFacade = new GameFacade({
			scene,
			container,
			motivation: contextVars.motivation,
			idea: contextVars.idea,
			progress: contextVars.progress,
			life: contextVars.life,
			numOfObstacle: contextVars.numbOfObstacle,
		});
		scene.setTimeout(() => next(), 2000);
	}
	protected override handleGamePlay(context: LiveContext): (() => void) | void {
		// do-nothing
	}

	protected override handleSubmit({ scene, container }: LiveContext, next: () => void): (() => void) | void {
		const goBack = new g.FilledRect({
			scene,
			parent: container,
			x: container.width / 2,
			width: 200,
			height: 100,
			anchorX: 0.5,
			cssColor: "firebrick",
			touchable: true
		});
		goBack.append(new g.Label({
			scene,
			font: new g.DynamicFont({
				game: g.game,
				size: 50,
				fontFamily: "sans-serif",
				fontColor: "white"
			}),
			x: goBack.width / 2,
			y: goBack.height / 2,
			width: goBack.width,
			anchorX: 0.5,
			anchorY: 0.5,
			text: "戻る",
			textAlign: "center",
			widthAutoAdjust: false,
		}));
		goBack.onPointDown.addOnce(() => {
			this.gameFacade.end();
			next();
		});
		this.gameFacade.onComplete.add(() => {
			goBack.destroy();
			next();
		});
		return () => {
			goBack.cssColor = "gray";
			goBack.touchable = false;
			goBack.modified();
		};
	}

	protected override evaluateScore(context: LiveContext): number {
		switch (this.gameFacade.status) {
			case "developing":
				return 0;
			case "success":
				return 100;
			case "fail":
				return this.gameFacade.progress * 90;
		}
	}

	protected override handleResultViewing(context: LiveContext, score: number, next: () => void): (() => void) | void {
		const vars = context.vars as ContextVars;
		vars.progress = this.gameFacade.progress;
		vars.life = this.gameFacade.life;
		// 残り体力が少なければ全回復
		if (vars.life < constants.lifeGauge.damage) {
			vars.life = constants.lifeGauge.life;
		}
		vars.numbOfObstacle = this.gameFacade.numOfObstacle;
		if (this.gameFacade.status === "success") {
			vars.stage = "success";
		}
		vars.onLiveGameResult.fire({ gameType: "develop", score });
		if (vars.stage !== "success") {
			context.scene.setTimeout(() => next(), 2000);
		} else {
			(async () => {
				// 残り体力に応じたボーナス
				while (this.gameFacade.lifeBonus()) {
					const offset = context.container.localToGlobal({
						x: constants.lifeGauge.x + this.gameFacade.life / constants.lifeGauge.life * constants.lifeGauge.width,
						y: constants.lifeGauge.y + constants.lifeGauge.height / 2
					});
					const bonus = new g.Sprite({
						scene: context.scene,
						parent: context.scene,
						src: context.scene.asset.getImageById("smile"),
						x: offset.x,
						y: offset.y,
						anchorX: 0.5,
						anchorY: 0.5,
					});
					let v = { x: -7.5, y: 0 };
					bonus.onUpdate.add(() => {
						v.y += 0.125;
						if (bonus.y > g.game.height - bonus.height / 2 - v.y && v.y > 0) {
							v.y *= -0.975;
							// TODO: 加点
						}
						if (bonus.x < bonus.width / 2 && v.x < 0) {
							v.x *= -1;
						}
						if (bonus.x > context.container.width + bonus.width / 2 && v.x > 0) {
							v.x *= -1;
						}
						bonus.x += v.x;
						bonus.y += v.y;
						bonus.modified();
					});
					await sleep(200);
				}
				await sleep(2000);
				next();
			})();
		}
	}
}
