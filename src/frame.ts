/**
 * 枠で囲ったフレーム
 */
export class Frame extends g.E {
	readonly body: g.FilledRect;

	constructor(opts: FrameOptions) {
		super(opts);
		const bodyMask = new g.FilledRect({
			scene: this.scene,
			x: opts.strokeWidth,
			y: opts.strokeWidth,
			width: opts.width - opts.strokeWidth * 2,
			height: opts.height - opts.strokeWidth * 2,
			cssColor: "white",
			compositeOperation: "destination-out"
		});
		const outer = new g.FilledRect({
			scene: this.scene,
			parent: this,
			x: 0,
			y: 0,
			width: opts.width,
			height: opts.height,
			cssColor: opts.strokeColor
		});
		outer.append(bodyMask);
		this.body = new g.FilledRect({
			scene: this.scene,
			parent: this,
			x: opts.strokeWidth,
			y: opts.strokeWidth,
			width: opts.width - opts.strokeWidth * 2,
			height: opts.height - opts.strokeWidth * 2,
			cssColor: opts.fillColor,
			opacity: opts.fillOpacity
		});
	}
}

export interface FrameOptions extends g.EParameterObject {
	/**
	 * 枠の太さ
	 */
	strokeWidth: number;
	/**
	 * 枠の色
	 */
	strokeColor: string;
	/**
	 * フレーム内の色
	 */
	fillColor: string;
	/**
	 * フレーム内の色の透明度
	 */
	fillOpacity: number;
}
