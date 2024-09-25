import { Attacker } from "./attacker";
import { constants } from "./constants";

/**
 * ひたすら自身の向きに Attacker (弾) を生成する
 */
export class Shooter extends g.FilledRect {
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
					cssColor: constants.attacker.color,
					x: this.x,
					y: this.y,
					width: constants.attacker.size,
					height: constants.attacker.size,
					anchorX: 0.5,
					anchorY: 0.5,
					speed: constants.attacker.speed,
					theta: this.angle / 180 * Math.PI,
				});
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

export interface ShooterOptions extends g.FilledRectParameterObject {
	/**
	 * Attack (弾)を生成する間隔（ミリ秒）
	 */
	interval: number;
}
