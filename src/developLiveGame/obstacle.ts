import { Frame, FrameOptions } from "../frame";
import { playForcibly } from "../utils";
import { constants } from "./constants";

/**
 * ゲームの完成を阻止する障壁
 *
 * 一定期間放置で爆発＝ペナルティ
 * Attacker による 一定ダメージで破壊
 */
export class Obstacle extends Frame {
	/**
	 * 一定期間放置すると発火
	 */
	readonly onExpire = new g.Trigger();
	/**
	 * expire 前に発火
	 */
	readonly onWarn = new g.Trigger();
	/**
	 * 破壊されると発火
	 */
	readonly onBreak = new g.Trigger();
	/**
	 * 残り体力
	 */
	private life: number;
	/**
	 * 破壊できたときに説明に使うフォント
	 */
	private readonly successFont: g.Font;
	/**
	 * 爆発したとき説明に使うフォント
	 */
	private readonly failedFont: g.Font;

	/**
	 * 障壁の説明文
	 */
	private static descriptions: string[][] = [
		["動かない"],
		["たまにバグる"],
		["絵心がない"],
		["サウンドを作れない"],
		["唐突なフリーズ"],
		["本当に面白い？", "自問自答"],
		["テストプレイを依頼", "する友人がいない"],
		["人前でしか", "起こらないバグ"],
		["バグを直すと", "バグが増える"],
		["ソースコードが", "散らかっていく"],
		["コピペの勢いが", "止まらない"],
		["コピペしまくった箇所に", "バグがあった"],
		["プレイヤーからの", "謎のバグ報告"],
		["最新版が行方不明"],
		["SNSで進捗報告", "説明しづらい"],
		["1ピクセル", "右に動かしたい"],
		["音量ちょっと", "小さいかな"],
		["繰り返すテスト", "飽きてくる"],
		["画像のサイズが", "ちょっと大きい"],
		["難しすぎと", "叱られる"],
		["隠し要素に", "気づかれない",],
		["ボタンを連打", "されると恐怖"],
	];

	/**
	 * 障壁を新規作成する際に設定する説明文のプール
	 */
	private static desriptionPool: string[][] = [...Obstacle.descriptions];

	constructor(opts: ObstacleOptions) {
		super(opts);
		// プールが空になったらプール再生成
		if (Obstacle.desriptionPool.length === 0) {
			Obstacle.desriptionPool = [...Obstacle.descriptions];
		}
		this.successFont = opts.successFont;
		this.failedFont = opts.failedFont;
		const description = Obstacle.desriptionPool.splice(Math.floor(g.game.random.generate() * Obstacle.desriptionPool.length), 1)[0];
		for (let i = 0; i < description.length; i++) {
			const label = new g.Label({
				scene: this.scene,
				parent: this,
				anchorX: 0.5,
				anchorY: 0.5,
				x: this.width / 2,
				y: this.height * (i + 0.5) / description.length,
				font: opts.font,
				text: description[i]
			});
			// はみ出ないように横幅を縮める
			if (label.width > this.width - 10) {
				label.scaleX = (this.width - 10) / label.width;
				label.modified();
			}
		}
		// interval ミリ秒後爆発
		this.scene.setTimeout(() => {
			if (!this.destroyed()) {
				this.body.cssColor = "red";
				this.modified();
				this.scene.setTimeout(() => {
					if (!this.destroyed()) {
						playForcibly("se_nc46976.wav");
						this.tearDown(false);
						this.onExpire.fire();
						this.destroy();
					}
				}, 500);
				this.onWarn.fire();
			}
		}, opts.span);
		this.life = opts.life;
	}

	/**
	 * 障壁の残り体力を減らす
	 */
	attack(): void {
		this.life--;
		playForcibly("se_nc141227.wav");
		if (this.life <= 0 && !this.destroyed()) {
			// 障壁を乗り越えた（破壊した）ときのエフェクト
			playForcibly("se_nc149103.wav");
			this.tearDown(true);
			this.onBreak.fire();
			this.destroy();
		}
	}

	/**
	 * 消滅アニメーションを表示します
	 */
	private tearDown(success: boolean): void {
		const tip = new g.FilledRect({
			scene: this.scene,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			anchorX: 0.5,
			anchorY: 0.5,
			cssColor: constants.obstacle.tipColor,
		});
		const label = new g.Label({
			scene: this.scene,
			x: this.x,
			y: this.y,
			anchorX: 0.5,
			anchorY: 0.5,
			font: success ? this.successFont : this.failedFont,
			text: success ? "解消！" : "挫折…",
		});
		this.scene.setTimeout(() => {
			if (!label.destroyed()) {
				label.destroy();
			}
		}, 500);
		const rate = success ? 0.1 : 0.05;
		tip.onUpdate.add(() => {
			tip.width -= this.width * rate;
			tip.height -= this.height * rate;
			if (tip.width < 0 || tip.height < 0) {
				tip.destroy();
				return true;
			}
			tip.modified();
		});
		this.parent.insertBefore(tip, this);
		this.parent.insertBefore(label, this);
	}
}

/**
 * Obstacle の初期化に必要なパラメタ
 */
export interface ObstacleOptions extends FrameOptions {
	/**
	 * 文字描画に使うフォント
	 */
	font: g.Font;
	/**
	 * この時間（ミリ秒）経過すると爆発する（ペナルティ）
	 */
	span: number;
	/**
	 * この回数 Attacker から攻撃を受けると破壊される（ボーナス）
	 */
	life: number;
	/**
	 * 破壊できたときに説明に使うフォント
	 */
	successFont: g.Font;
	/**
	 * 爆発したとき説明に使うフォント
	 */
	failedFont: g.Font;
}
