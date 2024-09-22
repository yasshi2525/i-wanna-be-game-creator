import { CommentCondition, CommentSchema } from "@yasshi2525/live-on-air";
import { debugMode } from "./globals";

/**
 * 指定したトリガが発火するまで待機します.
 *
 * @param trigger 発火を観察するトリガ
 * @returns Promise
 */
export const wait = async <T>(trigger: g.Trigger<T>): Promise<T> =>
	new Promise<T>(resolve => {
		trigger.addOnce(resolve);
	});


/**
 * 指定したミリ秒待機します.
 * @param millsec 待機時間 ミリ秒
 * @returns Promise
 */
export const sleep = async (millsec: number): Promise<void> =>
	new Promise<void>(resolve => {
		if (debugMode) {
			g.game.scene().onPointDownCapture.addOnce(() => resolve());
		} else {
			g.game.scene()!.setTimeout(resolve, millsec);
		}
	});

/**
 * 配列で定義した条件付きコメントを CommentSchema 型に変換します.
 * コメント間の余白が少ないので padding します.
 * TODO: live-on-airへの反映
 *
 * @param arr 配列で書いた条件付きコメント
 * @returns CommentSchema に変換した結果
 */
export const toCommentSchema = (...arr: [string, ...CommentCondition[]][]): CommentSchema[] =>
	arr.map(e => {
		const [comment, ...conditions] = e;
		return { comment: `  ${comment}  `, conditions };
	});
