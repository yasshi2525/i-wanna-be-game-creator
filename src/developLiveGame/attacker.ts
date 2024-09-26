/**
 * Obstacle を倒す攻撃手. 弾. ひたすら前進
 */
export class Attacker extends g.Sprite {
	/**
	 * 画面外に出たら発火
	 */
	readonly onOut = new g.Trigger();

	constructor(opts: AttackOptions) {
		super(opts);
		this.angle = opts.theta / Math.PI * 180;
		this.modified();
		const area = this.parent as g.E;
		this.onUpdate.add(() => {
			this.x += Math.cos(opts.theta) * opts.speed / g.game.fps;
			this.y += Math.sin(opts.theta) * opts.speed / g.game.fps;
			this.modified();
			if (this.x < area.x || this.x > area.x + area.width || this.y < area.y || this.y > area.y + area.height) {
				this.onOut.fire();
				this.destroy();
				return true;
			}
		});
	}
}

export interface AttackOptions extends g.SpriteParameterObject {
	/**
	 * 1秒あたり進む距離
	 */
	speed: number;
	/**
	 * 弾が向いている向き (ラジアン)
	 */
	theta: number;
}
