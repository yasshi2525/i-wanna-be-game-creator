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
	stage: "motivation" | "idea" | "develop";
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
 * やる気出すステージか
 * @param ctx CommentContext
 * @returns やる気出すステージの場合 true
 */
export const isMotivationStage: CommentCondition = ctx => (ctx.vars as ContextVars).stage === "motivation";
/**
 * アイデア出しステージか
 * @param ctx CommentContext
 * @returns アイデア出しステージの場合 true
 */
export const isIdeaStage: CommentCondition = ctx => (ctx.vars as ContextVars).stage === "idea";

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
