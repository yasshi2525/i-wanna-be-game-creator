import { CommentCondition } from "@yasshi2525/live-on-air";

export const debugMode = false;

/**
 * 文字切り替え時間
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TEXT_VIEW_TIME = 2500;
/**
 * 画像切り替えなどの短い時間
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const INTERVAL_TIME = 500;


/**
 * CommentContext の vars に定義するオブジェクトの型
 */
export type CommentContextVars = {
	stage: "motivation";
};

/**
 * やる気出すステージか
 * @param ctx CommentContext
 * @returns やる気出すステージの場合 true
 */
export const isMotivationStage: CommentCondition = ctx => (ctx.vars as CommentContextVars).stage === "motivation";

/**
 * Broadcaster の vars に定義するオブジェクトの型
 */
export type BroadcasterVars = {
	/**
	 * やる気. 0-2. すべての作業が motivation 倍の速度で行われる
	 */
	motivation: number;
};

/**
 * やる気の最大値
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const MAX_MOTIVATION = 2;
