import { Attacker } from "./attacker";
import { constants } from "./constants";

/**
 * ひたすら自身の向きに Attacker (弾) を生成する
 */
export class Shooter extends g.Sprite {
	/**
	 * 弾生成時に発火
	 */
	readonly onShoot = new g.Trigger<Attacker>();

	private readonly updateHandler: g.HandlerFunction<void>;

	constructor(opts: ShooterOptions) {
		super(opts);
		let duration = 0;
		this.updateHandler = () => {
			if (duration > opts.interval) {
				const a = new Attacker({
					scene: this.scene,
					parent: this.parent,
					...constants.attacker,
					x: this.x,
					y: this.y,
					anchorX: 0.5,
					anchorY: 0.5,
					theta: this.angle / 180 * Math.PI,
				});
				this.parent.insertBefore(a, this);
				this.onShoot.fire(a);
				duration -= opts.interval;
			}
			duration += 1000 / g.game.fps;
		};
		this.onUpdate.add(this.updateHandler);
	}

	end(): void {
		this.onUpdate.remove(this.updateHandler);
	}
}

export interface ShooterOptions extends g.SpriteParameterObject {
	/**
	 * Attack (弾)を生成する間隔（ミリ秒）
	 */
	interval: number;
}
