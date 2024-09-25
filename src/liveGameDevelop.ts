import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { GameFacade } from "./developLiveGame/gameFacade";
import { ContextVars } from "./globals";

/**
 * ゲーム開発をシューティングゲームに模したミニゲーム.
 *
 * 障壁 (Obstacle) が随時発生. 対処に時間がかかるとダメージ.
 * やる気を出して根性 (Shooter による Attacker 射出) で障壁をつぶす.
 * 開発が終了するまで耐える. // TODO
 * やる気が高いと Attacker の頻度Up // TODO
 * アイデアが良いと Attacker の爆発四散時の個数アップ // TODO
 */
export class DevelopLiveGame extends LiveGame {
	private gameFacade: GameFacade;

	protected override handleIntroduction({ scene, container, vars }: LiveContext, next: () => void): (() => void) | void {
		const { motivation, idea } = vars as ContextVars;
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "khaki",
			opacity: 0.5
		}));
		this.gameFacade = new GameFacade({ scene, container, motivation, idea });
	}
	protected override handleGamePlay(context: LiveContext): (() => void) | void {
		throw new Error("Method not implemented.");
	}
	protected override evaluateScore(context: LiveContext): number {
		throw new Error("Method not implemented.");
	}

	protected override handleResultViewing(context: LiveContext, score: number, next: () => void): (() => void) | void {
		const vars = context.vars as ContextVars;
		vars.onLiveGameResult.fire({ gameType: "develop", score });
		return super.handleResultViewing(context, score, next);
	}
}
