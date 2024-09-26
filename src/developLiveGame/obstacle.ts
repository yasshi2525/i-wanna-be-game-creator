/**
 * ゲームの完成を阻止する障壁
 *
 * 一定期間放置で爆発＝ペナルティ
 * Attacker による 一定ダメージで破壊
 */
export class Obstacle extends g.FilledRect {
	/**
	 * 一定期間放置すると発火
	 */
	readonly onExpire = new g.Trigger();
	/**
	 * 破壊されると発火
	 */
	readonly onBreak = new g.Trigger();
	/**
	 * 残り体力
	 */
	private life: number;

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
		["コピペしたコードに", "バグがあった"],
		["プレイヤーからの", "謎のバグ報告"],
		["最新版が行方不明"],
		["SNSで進捗報告", "説明しづらい"],
		["1ピクセル", "右に動かしたい"],
		["音量ちょっと", "小さいかな"],
		["繰り返すテスト", "ゲームに飽きる"],
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
				this.cssColor = "red";
				this.modified();
				this.scene.setTimeout(() => {
					if (!this.destroyed()) {
						this.onExpire.fire();
						this.destroy();
					}
				}, 500);
			}
		}, opts.span);
		this.life = opts.life;
	}

	/**
	 * 障壁の残り体力を減らす
	 */
	attack(): void {
		this.life--;
		if (this.life <= 0 && !this.destroyed()) {
			// 障壁を乗り越えた（破壊した）ときのエフェクト
			const tip = new g.FilledRect({
				scene: this.scene,
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
				anchorX: 0.5,
				anchorY: 0.5,
				cssColor: this.cssColor,
			});
			tip.onUpdate.add(() => {
				tip.width -= this.width * 0.1;
				tip.height -= this.width * 0.1;
				if (tip.width < 0 || tip.height < 0) {
					tip.destroy();
					return true;
				}
				tip.modified();
			});
			this.parent.insertBefore(tip, this);
			this.destroy();
			this.onBreak.fire();
		}
	}
}

/**
 * Obstacle の初期化に必要なパラメタ
 */
export interface ObstacleOptions extends g.FilledRectParameterObject {
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
}
