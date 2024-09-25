/**
 * ゲームの完成度. 進捗.
 *
 * 弾 (Attacker) が領域外で消える際進む
 */
export class Progressor extends g.E {
	/**
	 * 完成したら発火する
	 */
	readonly onComplete = new g.Trigger();
	/**
	 * 弾1発分の進捗で増える横幅
	 */
	private unit: number;
	/**
	 * 進捗バー
	 */
	private gauge: g.FilledRect;

	constructor(opts: ProgressorOptions) {
		super(opts);
		this.gauge = new g.FilledRect({
			scene: this.scene,
			parent: this,
			width: 0,
			height: this.height,
			cssColor: opts.color,
		});
		this.unit = this.width * opts.magnitude;
	}

	/**
	 * 進捗を進める. 1弾分すすめる
	 */
	progress(): void {
		this.gauge.width += this.unit;
		if (this.gauge.width >= this.width) {
			this.gauge.width = this.width;
			this.onComplete.fire();
		}
		this.modified();
	}
}

export interface ProgressorOptions extends g.EParameterObject {
	/**
	 * 弾1発分につき上がる完成度 (1で完成)
	 */
	magnitude: number;
	/**
	 * 進捗バーの色
	 */
	color: string;
}
