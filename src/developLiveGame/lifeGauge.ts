import { playForcibly } from "../utils";
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
	private ended: boolean;

	constructor(opts: LifeGaugeOptions) {
		super(opts);
		this.gauge = new g.FilledRect({
			scene: this.scene,
			parent: this,
			width: opts.width * opts.initLife / opts.life,
			height: opts.height,
			cssColor: opts.color
		});
		this.append(new g.Label({
			scene: this.scene,
			font: new g.DynamicFont({
				game: g.game,
				fontFamily: "sans-serif",
				size: this.height * 0.8
			}),
			text: "体力",
			width: this.width,
			y: this.height / 2,
			anchorY: 0.5,
			textAlign: "center",
			widthAutoAdjust: false
		}));
		this.damage = opts.damage / opts.life * opts.width;
	}

	/**
	 * 障壁を監視対象に追加します
	 */
	watch(obstacle: Obstacle): void {
		// 爆発したら体力減
		obstacle.onExpire.add(() => {
			for (const offset of [
				{ x: -obstacle.width / 2, y: -obstacle.height / 2 },
				{ x: obstacle.width / 2, y: -obstacle.height / 2 },
				{ x: obstacle.width / 2, y: obstacle.height / 2 },
				{ x: -obstacle.width / 2, y: obstacle.height / 2 }
			]) {
				const effect = new g.Sprite({
					scene: this.scene,
					src: this.scene.asset.getImageById("damage"),
					x: obstacle.x + offset.x,
					y: obstacle.y + offset.y,
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
						playForcibly("se_nc1280.wav");
						effect.destroy();
						if (!this.ended) {
							this.gauge.width -= this.damage / 4;
							// 体力0でミニゲーム終了
							if (this.gauge.width <= 0) {
								this.gauge.width = 0;
								this.onDie.fire();
							}
							this.gauge.modified();
						}
						return true;
					}
					effect.modified();
					v += 0.1;
				});
				this.parent.insertBefore(effect, obstacle);
			}

		});
	}

	end(): void {
		this.ended = true;
	}

	/**
	 * 指定の体力分、強制的に減らします. 減らせたかどうかを返します.
	 */
	substract(value: number): boolean {
		this.gauge.width -= value;
		if (this.gauge.width < 0) {
			this.gauge.width = 0;
		}
		this.gauge.modified();
		return this.gauge.width > 0;
	}

	/**
	 * 残り体力を取得します.
	 */
	get life(): number {
		return this.gauge.width / this.damage;
	}
}

export interface LifeGaugeOptions extends g.EParameterObject {
	/**
	 * 初期体力
	 */
	initLife: number;
	/**
	 * 体力の最大値
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
