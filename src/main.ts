import { LiveOnAirSceneBuilder } from "@yasshi2525/live-on-air";
import { GameMainParameterObject } from "./parameterObject";
import { SampleLiveGame } from "./sampleLiveGame";

export function main(param: GameMainParameterObject): void {
	// シーンを作成します.
	const scene = new LiveOnAirSceneBuilder(g.game)
		// 放送者を画面左中央に配置します
		.broadcaster({
			x: g.game.width / 4,
			y: g.game.height / 2,
			asset: g.game.asset.getImageById("player")
		})
		// 1つ目のスポットを配置します
		.spot({
			x: 500,
			y: 250,
			liveClass: SampleLiveGame
		})
		// 2つ目のスポットを配置します
		.spot({
			x: 750,
			y: 350
		})
		// 残り時間を設定します
		.ticker({
			frame: (param.sessionParameter.totalTimeLimit ?? 60) * g.game.fps
		})
		.build();
	scene.onLoad.add(() => {
		const spots = scene.spots;
		const screen = scene.screen;
		// 2つ目のスポットは 1つ目のスポットを攻略しなければ訪問できないようにします.
		spots[1].lockedBy(spots[0]);
		scene.onUpdate.add((): void => {
			if (screen.nowOnAir instanceof SampleLiveGame) {
				// 1つ目のスポット訪問時に始まる SampleLiveGame で 75点以上とった場合、2つ目のスポットを解放します.
				screen.nowOnAir.onSubmit.addOnce(({ score }) => {
					if (score >= 75) {
						spots[1].unlock(spots[0]);
					}
				});
			}
		});
	});
	g.game.pushScene(scene);
}
