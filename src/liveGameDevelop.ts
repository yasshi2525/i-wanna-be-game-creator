import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { constants } from "./developLiveGame/constants";
import { GameFacade } from "./developLiveGame/gameFacade";
import { Task } from "./developLiveGame/task";
import { ContextVars } from "./globals";
import { play, playForcibly, sleep } from "./utils";

/**
 * ゲーム開発をシューティングゲームに模したミニゲーム.
 *
 * 障壁 (Obstacle) が随時発生. 対処に時間がかかるとダメージ.
 * やる気を出して根性 (Shooter による Attacker 射出) で障壁をつぶす.
 */
export class DevelopLiveGame extends LiveGame {
	private gameFacade: GameFacade;
	private static failFont = new g.DynamicFont({
		game: g.game,
		fontFamily: "sans-serif",
		size: 100,
		fontColor: "firebrick",
		fontWeight: "bold",
		strokeColor: "white",
		strokeWidth: 10
	});
	private static successFont = new g.DynamicFont({
		game: g.game,
		fontFamily: "sans-serif",
		size: 100,
		fontColor: "mediumseagreen",
		fontWeight: "bold",
		strokeColor: "white",
		strokeWidth: 10
	});

	protected override handleIntroduction({ scene, container, vars }: LiveContext, next: () => void): (() => void) | void {
		const contextVars = vars as ContextVars;
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "khaki",
			opacity: 0.5
		}));
		if (contextVars.taskBounds === undefined) {
			contextVars.taskBounds = Task.init(container);
		}
		this.gameFacade = new GameFacade({
			scene,
			container,
			motivation: contextVars.motivation,
			idea: contextVars.idea,
			progress: contextVars.progress,
			life: contextVars.life,
			numOfObstacle: contextVars.numbOfObstacle,
			taskBounds: contextVars.taskBounds,
		});
		scene.setTimeout(() => next(), 2000);
	}
	protected override handleGamePlay(context: LiveContext): (() => void) | void {
		// do-nothing
	}

	protected override handleSubmit({ scene, container }: LiveContext, next: () => void): (() => void) | void {
		const goBack = new g.Sprite({
			scene,
			parent: container,
			src: scene.asset.getImageById("goback"),
			x: container.width / 2,
			anchorX: 0.5,
			opacity: 0.5,
			touchable: true
		});

		goBack.onPointDown.addOnce(() => {
			this.gameFacade.end();
			goBack.hide();
			next();
		});
		this.gameFacade.onComplete.add(success => {
			goBack.hide();
			if (!success) {
				container.append(new g.Label({
					scene,
					font: DevelopLiveGame.failFont,
					text: "心が折れました",
					x: container.width / 2,
					y: container.height / 2,
					anchorX: 0.5,
					anchorY: 0.5
				}));
				container.append(new g.Label({
					scene,
					font: DevelopLiveGame.failFont,
					fontSize: DevelopLiveGame.failFont.size / 3,
					text: "心の体力が無くなりました。再挑戦してください",
					x: container.width / 2,
					y: container.height / 2 + DevelopLiveGame.failFont.size,
					anchorX: 0.5,
					anchorY: 0.5
				}));
				play("developing_failed.wav");
			} else {
				container.append(new g.Label({
					scene,
					font: DevelopLiveGame.successFont,
					text: "完成",
					x: container.width / 2,
					y: container.height / 2,
					anchorX: 0.5,
					anchorY: 0.5
				}));
				play("developing_success.wav");
			}
			next();
		});
		return () => {
			goBack.destroy();
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
		switch (this.gameFacade.status) {
			case "developing":
				// 戻るを押した
				context.scene.onUpdate.addOnce(() => next());
				break;
			case "success":
				// 完成
				(async () => {
					if (!vars.isDie) {
						// 残り体力に応じたボーナス
						while (this.gameFacade.lifeBonus()) {
							const offset = context.container.localToGlobal({
								x: constants.lifeGauge.x + this.gameFacade.life / constants.lifeGauge.life * constants.lifeGauge.width,
								y: constants.lifeGauge.y + constants.lifeGauge.height / 2
							});
							const bonus = new g.Sprite({
								scene: context.scene,
								parent: context.container.parent,
								src: context.scene.asset.getImageById("smile"),
								x: offset.x - 100,
								y: offset.y - 100,
								anchorX: 0.5,
								anchorY: 0.5,
							});
							playForcibly("se_nc169787.mp3");
							let v = { x: -7.5, y: 0 };
							bonus.onUpdate.add(() => {
								v.y += 0.125;
								if (bonus.y + 100 > g.game.height - bonus.height / 2 - v.y && v.y > 0) {
									v.y *= -0.975;
									vars.scorer!.add(1);
									playForcibly("se_nc105302.wav");
								}
								if (bonus.x + 100 < bonus.width / 2 && v.x < 0) {
									v.x *= -1;
									vars.scorer!.add(1);
									playForcibly("se_nc105302.wav");
								}
								if (bonus.x + 100 > g.game.width - bonus.width / 2 && v.x > 0) {
									v.x *= -1;
									vars.scorer!.add(1);
									playForcibly("se_nc105302.wav");
								}
								bonus.x += v.x;
								bonus.y += v.y;
								bonus.modified();
							});
							await sleep(200);
						}
					}
					await sleep(2000);
					next();
				})();
				break;
			case "fail":
				// 体力切れ
				vars.isDie = true;
				context.scene.setTimeout(() => next(), 5000);
				break;
		}
		return () => this.flushTaskBounds(context);
	}

	/**
	 * 残り Task の座標を保存します
	 */
	private flushTaskBounds({ vars }: LiveContext): void {
		(vars as ContextVars).taskBounds = this.gameFacade.taskBounds;
	}
}
