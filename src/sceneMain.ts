import { LiveOnAirScene, LiveOnAirSceneBuilder } from "@yasshi2525/live-on-air";
import { Avatar } from "./avatar";
import {
	COMMENT_INTERVAL,
	ContextVars,
	HIGH_IDEA,
	HIGH_MOTIVATION,
	isDevelopingStage,
	isDevelopStage,
	isHighIdea,
	isHighMotivation,
	isIdeaLiveGame,
	isIdeaStage,
	isLiveGameFailed,
	isLiveGameResult,
	isLiveGameSuccess,
	isLowIdea,
	isLowMotivation,
	isMotivationLiveGame,
	isMotivationStage,
	isSuccess,
	LIVEGAME_COMMENT_INTERVAL,
	LIVEGAME_COMMENT_PER_SCORE,
	LOW_IDEA,
	LOW_MOTIVATION
} from "./globals";
import { DevelopLiveGame } from "./liveGameDevelop";
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
			}),
			unvisited: g.game.scene().asset.getImageById("spot_unvisited"),
			locked: g.game.scene().asset.getImageById("spot_locked"),
			normal: g.game.scene().asset.getImageById("spot_normal"),
			disabled: g.game.scene().asset.getImageById("spot_disabled"),
		})
		.commentSupplier({ comments: [] });

	// 内部パラメタ
	const contextVars: ContextVars = {
		stage: "motivation",
		motivation: 0,
		idea: 0,
		progress: 0,
		numbOfObstacle: 0,
		onLiveGameResult: new g.Trigger()
	};

	// Scene を以下の初期値で作成します
	const scene = new LiveOnAirSceneBuilder(g.game)
		.layer({
			comment: { x: 0, y: 100, width: g.game.width, height: 400 },
			screen: { x: 100, y: 100, width: g.game.width - 200, height: 400 }
		})
		.broadcaster({
			x: 50,
			y: 260,
			asset: g.game.scene().asset.getImageById("broadcaster")
		})
		.liveContext({
			vars: contextVars
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
			name: "ゲームを制作する",
			liveClass: DevelopLiveGame
		})
		.commentContext({
			vars: contextVars
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
				["時間ないぞー", isIdeaStage],
				["いよいよ本編ktkr!!", isDevelopStage],
				["ksk", isDevelopStage],
				["準備完了!!", isDevelopStage],
				["あとは作るのみ!!", isDevelopStage],
				["やる気あまりなくて草", isDevelopStage, isLowMotivation],
				["やる気最強で草", isDevelopStage, isHighMotivation],
				["アイデアそこそこで草", isDevelopStage, isLowIdea],
				["アイデア完璧で草", isDevelopStage, isHighIdea],
				["魂を飛ばしてゲーム作ろう！", isDevelopingStage],
				["魂を飛ばしまくると完成だ！", isDevelopingStage],
				["ゲーム作りは困難の連続…", isDevelopingStage],
				["困難を魂で吹きとばせ！", isDevelopingStage],
				["やる気あまりなくて草", isDevelopingStage, isLowMotivation],
				["このやる気だと時間かかりそう…", isDevelopingStage, isLowMotivation],
				["やる気最強で草", isDevelopingStage, isHighMotivation],
				["このやる気ならすぐ完成しそう！", isDevelopingStage, isHighMotivation],
				["アイデアそこそこで草", isDevelopingStage, isLowIdea],
				["このアイデアだと障壁にぶつかりそう…", isDevelopingStage, isLowIdea],
				["アイデア完璧で草", isDevelopingStage, isHighIdea],
				["このアイデアなら障壁もなさそう！", isDevelopingStage, isHighIdea],
				["888888888888888", isLiveGameResult, isLiveGameSuccess],
				["おおおおおおおお", isLiveGameResult, isLiveGameSuccess],
				["テンションあがる！", isLiveGameResult, isLiveGameSuccess],
				["やる気でたあぁぁ！", isMotivationLiveGame],
				["元気！げんき！ゲンキ！", isMotivationLiveGame],
				["やる気最強！やる気最強！", isMotivationLiveGame],
				["神アイデアｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!", isIdeaLiveGame],
				["アイデア降臨！", isIdeaLiveGame],
				["アイデアネ申", isIdeaLiveGame],
				["アイデア！あいであ！神発想！", isIdeaLiveGame],
				["アイデア最強！アイデア最強！", isIdeaLiveGame],
				["いったん引き返そう", isLiveGameResult, isLiveGameFailed],
				["もう一度やる気あげるのもアリかも", isLiveGameResult, isLiveGameFailed, isLowMotivation],
				["もう一度アイデア固めるのもアリかも", isLiveGameResult, isLiveGameFailed, isLowIdea],
				["完成したぁぁああ！！", isSuccess],
				["おめでとぉぉおお！！", isSuccess],
				["できたあぁぁああ！！", isSuccess],
				["きｔらああぁぁぁ！！", isSuccess],
				["マックスボルテージ！", isSuccess],
			),
			interval: COMMENT_INTERVAL
		})
		.commentDeployer({
			font: new g.DynamicFont({
				game: g.game,
				size: 40,
				fontFamily: "sans-serif",
				fontColor: "wheat",
				strokeColor: "black",
				strokeWidth: 4
			}),
			speed: 4
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

		// コメントが濃いので若干薄くします.
		scene.layer.comment.opacity = 0.5;
		scene.layer.comment.modified();

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

		// ミニゲームが始まったらマップを薄くします
		scene.screen.onLiveStart.add(() => {
			scene.layer.field.opacity = 0.25;
			scene.layer.field.modified();
		});
		// ミニゲームが終わったらマップの薄さをもとに戻します
		scene.broadcaster.onLiveEnd.add(() => {
			scene.layer.field.opacity = 1;
			scene.layer.field.modified();
		});

		// ミニゲームの結果の際、一時的にコメントを増やします.
		contextVars.onLiveGameResult.add(e => {
			contextVars.liveGameResult = e;
			scene.commentSupplier.interval = Math.min(1000 / ((e.score + 1) * LIVEGAME_COMMENT_PER_SCORE), COMMENT_INTERVAL * 5);
			scene.setTimeout(() => {
				scene.commentSupplier.interval = COMMENT_INTERVAL;
				delete contextVars.liveGameResult;
			}, LIVEGAME_COMMENT_INTERVAL);
		});

		// ミニゲーム攻略にしたがって、 avatar のセリフを変化させます
		scene.broadcaster.onLiveEnd.add(live => {
			if (contextVars.stage === "motivation" && scene.spots[1].lockedBy().length === 0) {
				contextVars.stage = "idea";
				avatar.text = "次は、アイデアを固めるでぇ～す!!";
			}
			if (contextVars.stage === "idea" && scene.spots[2].lockedBy().length === 0) {
				contextVars.stage = "develop";
				avatar.text = "いよいよゲームを作るでぇ～す!!";
			}
			if (live instanceof DevelopLiveGame) {
				if (contextVars.stage !== "success") {
					contextVars.stage = "retry";
					avatar.text = "一旦、体制を立て直すでぇ～す!!";
				} else {
					for (const spot of scene.spots) {
						spot.disable();
					}
					avatar.text = "ゲームが完成したでぇ～す!!";
				}
			}
		});

		// 最後の開発ミニゲームの際はそれまでのゲーム結果にしたがったセリフに変えます
		scene.screen.onLiveStart.add(live => {
			if (live instanceof DevelopLiveGame) {
				contextVars.stage = "developing";
				if (contextVars.motivation < LOW_MOTIVATION) {
					avatar.text = "やる気が低くて、作業が捗りませぇ～ん!!";
				} else if (contextVars.idea < LOW_IDEA) {
					avatar.text = "アイデアが微妙で、困難だらけでぇ～す!!";
				} else if (contextVars.motivation > HIGH_MOTIVATION) {
					avatar.text = "やる気に燃えて、作業が捗るでぇ～す!!";
				} else if (contextVars.idea > HIGH_IDEA) {
					avatar.text = "アイデアが秀逸で、困難もなく順調でぇ～す!!";
				} else {
					avatar.text = "困難を打ち倒しながら、前に駆け出すでぇ～す!!";
				}
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
			model: contextVars
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
