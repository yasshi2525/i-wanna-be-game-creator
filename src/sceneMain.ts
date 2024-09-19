import { LiveOnAirScene, LiveOnAirSceneBuilder } from "@yasshi2525/live-on-air";
import { Avatar } from "./avatar";
import { SampleLiveGame } from "./sampleLiveGame";
import { ClosingScene } from "./sceneClosing";
import { sleep, wait } from "./utils";

// テキスト表示時間
// eslint-disable-next-line @typescript-eslint/naming-convention
const TEXT_VIEW_TIME = 3000;
// eslint-disable-next-line @typescript-eslint/naming-convention
const OPENING_SEC = 10;
// ゲーム終了後の待機時間
// eslint-disable-next-line @typescript-eslint/naming-convention
const CLOSING_SEC = 15;

export const createMainScene = (totalTimeLimit: number): LiveOnAirScene & g.Scene => {
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
			y: (g.game.height - 200) / 2,
			liveClass: SampleLiveGame,
			name: "ゲージを溜める"
		})
		.spot({
			x: g.game.width / 2,
			y: (g.game.height - 200) / 2,
			name: "狙いを定める"
		})
		.spot({
			x: g.game.width * 3 / 4,
			y: (g.game.height - 200) / 2,
			name: "イチかバチか"
		})
		.spot({
			x: g.game.width / 4,
			y: (g.game.height - 200) / 4,
			liveClass: SampleLiveGame,
		})
		.spot({
			x: g.game.width / 2,
			y: (g.game.height - 200) / 4,
		})
		.spot({
			x: g.game.width * 3 / 4,
			y: (g.game.height - 200) / 4,
		})
		.ticker({
			frame: (totalTimeLimit - OPENING_SEC - CLOSING_SEC) * g.game.fps
		})
		.build();
	scene.onLoad.add(() => {
		// Avatarにゲームの説明をさせる
		// 会話のためのレイヤを追加
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

		const { broadcaster, layer, field, spots, ticker } = scene;

		// 上級スポットをロックする
		spots[3].lockedBy(spots[0]);
		spots[4].lockedBy(spots[1]);
		spots[5].lockedBy(spots[2]);

		// イントロの会話のためスポットを非表示
		layer.field.hide();

		// 会話：導入
		(async () => {
			beginner.text = "うぇーん、ゲームってどう作るのぉ…";
			await wait(beginner.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			beginner.text = "";
			guide.text = "どんなゲームを作りたいんだい？！";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "";
			beginner.text = "まだ決めてないし、アイデアもないよぉ…";
			await wait(beginner.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			beginner.text = "";
			layer.field.show();
			guide.text = "じゃあ３つサンプルを用意したから、";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "どれがいいか選んでくれぇ！";
			await wait(guide.onSpeak);
			await sleep(TEXT_VIEW_TIME);
			guide.text = "";
			await wait(guide.onSpeak);
			beginner.text = "どれが面白そうかなぁ？";
		})();

		// Spot に入って生放送が始まったら Avatar を隠す。終わったら戻す。
		broadcaster.onEnter.add(() => {
			beginner.text = "";
			beginner.view.hide();
			guide.text = "";
			guide.view.hide();
		});
		broadcaster.onLiveEnd.add(() => {
			beginner.view.show();
			guide.view.show();
		});

		// 最初のミニゲームプレイが終わったら
		broadcaster.onLiveEnd.addOnce(() => {
			// 会話優先のためスポット訪問無効
			field.disableSpotExcept(undefined);
			// 会話
			(async () => {
				const selectedGame = broadcaster.staying.name;
				guide.text = `${selectedGame}ゲームはどうだったかい？`;
				await wait(guide.onSpeak);
				await sleep(TEXT_VIEW_TIME);
				guide.text = "";
				beginner.text = "こういうミニゲームな感じね";
				await wait(beginner.onSpeak);
				await sleep(TEXT_VIEW_TIME);
				field.enableSpotExcept(undefined);
				beginner.text = "";
				guide.text = "他も遊んでみてくれぃ！";
				// 2回目のミニゲームプレイが終わったら
				broadcaster.onLiveEnd.add(() => {
					(async () => {
						await sleep(TEXT_VIEW_TIME);
						beginner.text = "どれもいいなぁ…";
						await wait(beginner.onSpeak);
						await sleep(TEXT_VIEW_TIME);
						beginner.text = "よしっ！おれ、ミニゲーム集をつくるよ！";
						await wait(beginner.onSpeak);
						await sleep(TEXT_VIEW_TIME);
						beginner.text = "";
						guide.text = "そんなアナタにオススメがコチラ！";
						await wait(beginner.onSpeak);
						await sleep(TEXT_VIEW_TIME);
					})();
				});
				await wait(guide.onSpeak);
				await sleep(TEXT_VIEW_TIME);
				guide.text = "";
				g.game.pushScene(new ClosingScene({ game: g.game }));
			})();
		});

		// ゲームが終わったら
		ticker.onExpire.addOnce(() => {
			g.game.pushScene(new ClosingScene({ game: g.game }));
		});
	});
	return scene;
};
