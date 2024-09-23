import { LiveOnAirScene, LiveOnAirSceneBuilder } from "@yasshi2525/live-on-air";
import { Avatar } from "./avatar";
import { BroadcasterVars, CommentContextVars, isIdeaStage, isMotivationStage } from "./globals";
import { IdeaLiveGame } from "./liveGameIdea";
import { MotivationLiveGame } from "./liveGameMotivation";
import { ClosingScene } from "./sceneClosing";
import { ScoreBoard } from "./scoreBoard";
import { toCommentSchema } from "./utils";

export interface MainSceneOptions {
	totalTimeLimit: number;
}

export const createMainScene = ({ totalTimeLimit }: MainSceneOptions): LiveOnAirScene & g.Scene => {
	// TODO: わこつ 消せない

	// Spot 共通のフォントを指定します
	LiveOnAirSceneBuilder.getDefault(g.game)
		.spot({
			labelFont: new g.DynamicFont({
				game: g.game,
				size: 30,
				fontFamily: "sans-serif",
				fontColor: "black",
				strokeColor: "white",
				strokeWidth: 5,
			})
		})
		.commentSupplier({ comments: [] });

	// Scene を以下の初期値で作成します
	const scene = new LiveOnAirSceneBuilder(g.game)
		.layer({
			comment: { x: 0, y: 100, width: g.game.width, height: 400 },
			screen: { x: 100, y: 100, width: g.game.width - 200, height: 400 }
		})
		.broadcaster({
			x: 50,
			y: 260,
			vars: { motivation: 0, idea: 0 } satisfies BroadcasterVars
		})
		.spot({
			x: 300,
			y: 260,
			name: "やる気をだす",
			liveClass: MotivationLiveGame
		})
		.spot({
			x: g.game.width / 2,
			y: 260,
			name: "アイデアをだす",
			liveClass: IdeaLiveGame
		})
		.spot({
			x: g.game.width * 3 / 4,
			y: 260,
			name: "仮置き"
		})
		.commentContext({
			vars: { stage: "motivation" } satisfies CommentContextVars
		})
		.commentSupplier({
			comments: toCommentSchema(
				["やる気大事！", isMotivationStage],
				["やる気だしてこ！", isMotivationStage],
				["まずはそこからかよｗｗｗ", isMotivationStage],
				["早く作れしｗｗｗ", isMotivationStage],
				["間に合わなくなっても知らんぞｗｗｗ", isMotivationStage],
				["やっぱアイデアよ、大事なのは", isIdeaStage],
				["一番いいアイデアを頼む", isIdeaStage],
				["今から考えるんかいｗｗｗ", isIdeaStage],
				["ノーアイデアで草", isIdeaStage],
				["時間ないぞー", isIdeaStage]
			),
		})
		.commentDeployer({
			speed: 8
		})
		.ticker({
			frame: (totalTimeLimit - 10) * g.game.fps
		})
		.build();

	// Scene の初期化処理を定義します
	scene.onLoad.add(() => {
		// 後続の Spot をロックする.
		scene.spots[1].lockedBy(scene.spots[0]);
		scene.spots[2].lockedBy(scene.spots[1]);

		// 各種表示用のレイヤを作成します
		const overlay = new g.E({
			scene,
			parent: scene,
			width: g.game.width,
			height: g.game.height
		});
		// avatar を表示させます
		const avatar = new Avatar({ scene, container: overlay, side: "left" });
		avatar.text = "まずは、やる気を出すでぇ～す!!";

		// ミニゲーム攻略にしたがって、 avatar のセリフを変化させます
		scene.broadcaster.onLiveEnd.add(() => {
			const vars = scene.commentContext.vars as CommentContextVars;
			if (vars.stage === "motivation" && scene.spots[1].lockedBy().length === 0) {
				vars.stage = "idea";
				avatar.text = "次は、アイデアを固めるでぇ～す!!";
			}
			if (vars.stage === "idea" && scene.spots[2].lockedBy().length === 0) {
				vars.stage = "develop";
				avatar.text = "いよいよゲームを作るでぇ～す!!";
			}
		});


		// ミニゲームの結果獲得されるパラメタを表示します.
		const paramFont = new g.DynamicFont({
			game: g.game,
			size: 40,
			fontFamily: "monospace",
			fontColor: "green",
			strokeColor: "white",
			strokeWidth: 5
		});
		const scoreBoard = new ScoreBoard({
			scene,
			parent: overlay,
			x: g.game.width - 300,
			y: g.game.height - 180,
			width: 300,
			font: paramFont,
			model: scene.broadcaster.vars as BroadcasterVars
		});

		// ミニゲームが終わったらパラメタ表示を最新にします
		scene.broadcaster.onLiveEnd.add(() => {
			scoreBoard.notify();
		});

		// 残り時間がなくなったら結果表示画面へ
		scene.ticker.onExpire.addOnce(() => {
			g.game.pushScene(new ClosingScene({ game: g.game }));
		});
	});
	return scene;
};
