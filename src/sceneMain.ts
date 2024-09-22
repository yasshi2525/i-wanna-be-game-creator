import { CommentCondition, LiveOnAirScene, LiveOnAirSceneBuilder } from "@yasshi2525/live-on-air";
import { Avatar } from "./avatar";
import { MotivationLiveGame } from "./liveGameMotivation";
import { ClosingScene } from "./sceneClosing";
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
		})
		.spot({
			x: 300,
			y: 260,
			name: "やる気をだす",
			liveClass: MotivationLiveGame
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
				["間に合わなくなっても知らんぞｗｗｗ", isMotivationStage]
			)
		})
		.commentDeployer({
			speed: 8
		})
		.ticker({
			frame: (totalTimeLimit - 10) * g.game.fps
		})
		.build();
	scene.onLoad.add(() => {
		// avatar を表示させます
		const overlay = new g.E({
			scene,
			parent: scene,
			width: g.game.width,
			height: g.game.height
		});
		const avatar = new Avatar({ scene, container: overlay, side: "left" });
		avatar.text = "まずは、やる気を出すでぇ～す!!";

		// 残り時間がなくなったら結果表示画面へ
		scene.ticker.onExpire.addOnce(() => {
			g.game.pushScene(new ClosingScene({ game: g.game }));
		});
	});
	return scene;
};

/**
 * CommentContext の vars に定義するオブジェクトの型
 */
type CommentContextVars = {
	stage: "motivation";
};

/**
 * やる気出すステージか
 * @param ctx CommentContext
 * @returns やる気出すステージの場合 true
 */
const isMotivationStage: CommentCondition = ctx => (ctx.vars as CommentContextVars).stage === "motivation";
