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
	private ended: boolean;

	constructor(opts: ProgressorOptions) {
		super(opts);
		this.gauge = new g.FilledRect({
			scene: this.scene,
			parent: this,
			width: opts.progress === 0 ? 1 : opts.progress * this.width,
			height: this.height,
			cssColor: opts.color,
		});
		this.append(new g.Label({
			scene: this.scene,
			font: new g.DynamicFont({
				game: g.game,
				fontFamily: "sans-serif",
				size: this.height * 0.8
			}),
			text: "完成度",
			width: this.width,
			y: this.height / 2,
			anchorY: 0.5,
			textAlign: "center",
			widthAutoAdjust: false
		}));
		this.unit = this.width * opts.magnitude;
	}

	/**
	 * 進捗を進める. 1弾分すすめる
	 */
	progress(loc: g.CommonOffset): void {
		const effect = new g.Sprite({
			scene: this.scene,
			parent: this.parent,
			src: this.scene.asset.getImageById("progress_unit"),
			x: loc.x,
			y: loc.y,
			anchorX: 0.5,
			anchorY: 0.5,
			scaleX: 0.5,
			scaleY: 0.5
		});
		let v = 2;
		effect.onUpdate.add(() => {
			const theta = Math.atan2(this.y + this.height / 2 - effect.y, this.x + this.gauge.width - effect.x);
			effect.x += Math.cos(theta) * v;
			effect.y += Math.sin(theta) * v;
			if (g.Util.distance(effect.x, effect.y, this.x + this.gauge.width, this.y + this.height / 2)
				< effect.width * effect.scaleX / 2) {
				effect.destroy();
				if (!this.ended) {
					this.gauge.width += this.unit;
					if (this.gauge.width >= this.width) {
						this.gauge.width = this.width;
						this.onComplete.fire();
					}
					this.modified();
				}
				return true;
			}
			effect.modified();
			v += 0.1;
		});
	}

	end(): void {
		this.ended = true;
	}

	/**
	 * 現在の進捗を0-1で返します.
	 */
	get value(): number {
		return this.gauge.width / this.width;
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
	/**
	 * 進捗の初期値
	 */
	progress: number;
}
