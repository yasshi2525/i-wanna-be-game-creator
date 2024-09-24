import { CommentCondition } from "@yasshi2525/live-on-air";

export const debugMode = false;

/**
 * 文字切り替え時間
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TEXT_VIEW_TIME = 2500;
/**
 * 心の声などの速度の早い文字切り替え時間
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TWEET_VIEW_TIME = 800;
/**
 * 画像切り替えなどの短い時間
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const INTERVAL_TIME = 500;

/**
 * CommentContext, LiveContext の vars に定義するオブジェクトの型
 */
export interface ContextVars {
	/**
	 * ゲームの状態. これによりコメントの内容や Avatar の発言が変わる.
	 *
	 * motivation: これからやる気を出す
	 *
	 * idea: これからアイデアを出す
	 *
	 * develop: これからゲームつくる
	 */
	stage: "motivation" | "idea" | "develop";

	/**
	 * 直近のミニゲーム結果
	 */
	liveGameResult?: LiveGameResult;

	/**
	 * ミニゲームの結果が出た際発火される
	 */
	onLiveGameResult: g.Trigger<LiveGameResult>;
	/**
	 * やる気. 0-1.8. すべての作業が motivation 倍の速度で行われる
	 */
	motivation: number;
	/**
	 * アイデア. 0-1.8. 以降のすべての作業が idea 倍の速度で行われる
	 */
	idea: number;
}
/**
 * ミニゲーム結果後のコメント反応時間中か
 */
export const isLiveGameResult: CommentCondition = ctx => (ctx.vars as ContextVars).liveGameResult !== undefined;

/**
 * やる気出すステージか
 */
export const isMotivationStage: CommentCondition = ctx => !isLiveGameResult(ctx) && (ctx.vars as ContextVars).stage === "motivation";
/**
 * アイデア出しステージか
 */
export const isIdeaStage: CommentCondition = ctx => !isLiveGameResult(ctx) && (ctx.vars as ContextVars).stage === "idea";

/**
 * やる気を出すミニゲームの結果判明後か
 */
export const isMotivationLiveGame: CommentCondition = ctx => isLiveGameResult(ctx)
	&& (ctx.vars as ContextVars).liveGameResult?.gameType === "motivation";

/**
 * アイデアを出すミニゲームの結果判明後か
 */
export const isIdeaLiveGame: CommentCondition = ctx => isLiveGameResult(ctx)
	&& (ctx.vars as ContextVars).liveGameResult?.gameType === "idea";

/**
 * やる気の最大値
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MAX_MOTIVATION = 1.8;

/**
 * アイデアの最大値
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MAX_IDEA = 1.8;

/**
 * ミニゲームで1点とるともらえる1秒あたりのコメント
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LIVEGAME_COMMENT_PER_SCORE = 0.05;

/**
 * ミニゲームで得点獲得後コメントが出る期間（ミリ秒）
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LIVEGAME_COMMENT_INTERVAL = 5000;

interface LiveGameResult {
	/**
	 * ミニゲームの種類
	 */
	gameType: "motivation" | "idea" | "develop";
	/**
	 * ミニゲームの結果. 100点満点
	 */
	score: number;
}

/**
 * 通常時のコメント間隔
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const COMMENT_INTERVAL = 800;
