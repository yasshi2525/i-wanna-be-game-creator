/**
 * Obstacle を倒す攻撃手. 弾. ひたすら前進
 * TODO: out 時に progress が進む演出
 */
export class Attacker extends g.FilledRect {
	/**
	 * 画面外に出たら発火
	 */
	readonly onOut = new g.Trigger();

	constructor(opts: AttackOptions) {
		super(opts);
		this.angle = opts.theta / Math.PI * 180;
		this.modified();
		const area = (this.parent as g.E).calculateBoundingRect();
		this.onUpdate.add(() => {
			this.x += Math.cos(opts.theta) * opts.speed / g.game.fps;
			this.y += Math.sin(opts.theta) * opts.speed / g.game.fps;
			this.modified();
			if (this.x < area.left || this.x > area.right || this.y < area.top || this.y > area.bottom) {
				this.destroy();
				this.onOut.fire();
				return true;
			}
		});
	}
}

export interface AttackOptions extends g.FilledRectParameterObject {
	/**
	 * 1秒あたり進む距離
	 */
	speed: number;
	/**
	 * 弾が向いている向き (ラジアン)
	 */
	theta: number;
}
