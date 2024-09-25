import { Obstacle } from "./obstacle";

/**
 * 残り体力.
 *
 * 障壁 (Obstacle) が 爆発 (expire) すると減る.
 * 0になるとミニゲームが終わる（要再挑戦）
 */
export class LifeGauge extends g.E {
	/**
	 * 残りライフが 0 になったら発火する
	 */
	readonly onDie = new g.Trigger();
	/**
	 * 残り体力ゲージ
	 */
	private readonly gauge: g.FilledRect;
	/**
	 * expire 1発によるゲージの減少幅
	 */
	private readonly damage: number;

	constructor(opts: LifeGaugeOptions) {
		super(opts);
		this.gauge = new g.FilledRect({
			scene: this.scene,
			parent: this,
			width: opts.width,
			height: opts.height,
			cssColor: opts.color
		});
		this.damage = opts.damage / opts.life * this.gauge.width;
	}

	/**
	 * 障壁を監視対象に追加します
	 */
	watch(obstacle: Obstacle): void {
		// 爆発したら体力減
		obstacle.onExpire.add(() => {
			this.gauge.width -= this.damage;
			// 体力0でミニゲーム終了
			if (this.gauge.width < 0) {
				this.gauge.width = 0;
				this.onDie.fire();
			}
			this.gauge.modified();
		});
	}
}

export interface LifeGaugeOptions extends g.EParameterObject {
	/**
	 * 初期体力（体力の最大値）
	 */
	life: number;
	/**
	 * 1回 expire されたときの減少体力
	 */
	damage: number;
	/**
	 * 体力バーの色
	 */
	color: string;
}
