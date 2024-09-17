import { LiveOnAirSceneBuilder } from "@yasshi2525/live-on-air";
import { Avatar } from "./avatar";
import { GameMainParameterObject } from "./parameterObject";
import { SampleLiveGame } from "./sampleLiveGame";
import { sleep, wait } from "./utils";

const TEXT_VIEW_TIME = 2000;

export function main(param: GameMainParameterObject): void {
	// シーンを作成します.
	const scene = new LiveOnAirSceneBuilder(g.game)
		.layer({
			field: { x: 0, y: 100, width: g.game.width, height: g.game.height - 200 }
		})
		.broadcaster({
			x: 100,
			y: (g.game.height - 200) / 2,
			asset: g.game.asset.getImageById("player")
		})
		.spot({
			x: g.game.width / 4,
			y: 50,
			liveClass: SampleLiveGame
		})
		.spot({
			x: g.game.width / 2,
			y: 50
		})
		.spot({
			x: g.game.width * 3 / 4,
			y: 50
		})
		.ticker({
			frame: (param.sessionParameter.totalTimeLimit ?? 60) * g.game.fps
		})
		.build();
	scene.onLoad.add(() => {
		const layer = scene.layer;
		layer.field.hide();
		const characterLayer = new g.E({
			scene,
			parent: scene,
			x: 0,
			y: 0,
			width: g.game.width,
			height: g.game.height
		});
		const beginner = new Avatar({ scene, container: characterLayer, side: "left" });
		const guide = new Avatar({ scene, container: characterLayer, side: "right" });

		(async () => {
			await sleep(TEXT_VIEW_TIME);
			await sleep(TEXT_VIEW_TIME);
			await sleep(TEXT_VIEW_TIME);
			beginner.text = "うぇーん、ゲームってどう作るのぉ…";
			await wait(beginner.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			beginner.text = "";
			guide.text = "よしっ、一緒にやってみよう！";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "どんなゲームが作りたいんだい？！";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "";
			beginner.text = "まだ決めてないし、アイデアもないよぉ…";
			await wait(beginner.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			beginner.text = "";
			guide.text = "じゃあ３つサンプルを用意したから、";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "どれがいいか選んでくれぇ！";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "";
			await wait(guide.onSpeak);
			layer.field.show();
		})();
	});
	g.game.pushScene(scene);
}
