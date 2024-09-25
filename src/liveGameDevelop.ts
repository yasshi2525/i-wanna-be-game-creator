import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { GameFacade } from "./developLiveGame/gameFacade";
import { ContextVars } from "./globals";

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
		vars.numbOfObstacle = this.gameFacade.numOfObstacle;
		if (this.gameFacade.status === "success") {
			vars.stage = "success";
		}
		vars.onLiveGameResult.fire({ gameType: "develop", score });
		context.scene.setTimeout(() => next(), 2000);
	}
}
