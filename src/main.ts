import { GameMainParameterObject } from "./parameterObject";
import { TitleScene } from "./sceneTitle";

export function main(param: GameMainParameterObject): void {
	const totalTimeLimit = param.sessionParameter.totalTimeLimit ?? 100;
	g.game.pushScene(new TitleScene({ game: g.game, totalTimeLimit }));
}
