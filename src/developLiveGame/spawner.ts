import { constants } from "./constants";
import { Obstacle } from "./obstacle";

/**
 * 障壁 (Obstacle) を生成し続ける
 */
export class Spawner {
	/**
	 * Obstacle が生成されたとき発火
	 */
	readonly onCreate = new g.Trigger<Obstacle>();
	/**
	 * 現在のシーン
	 */
	private readonly scene: g.Scene;
	private ended: boolean;

	constructor(opts: SpawnerOptions) {
		let counter = 0;
		this.scene = opts.scene;
		this.scene.setInterval(() => {
			if (this.ended) {
				return;
			}
			const o = new Obstacle({
				scene: this.scene,
				parent: opts.container,
				x: g.game.random.generate() * (opts.container.width - constants.obstacle.width * 3) + constants.obstacle.width * 2,
				y: g.game.random.generate() * (opts.container.height - constants.obstacle.height * 2.5) + constants.obstacle.height * 1.5,
				width: constants.obstacle.width,
				height: constants.obstacle.height,
				anchorX: 0.5,
				anchorY: 0.5,
				cssColor: constants.obstacle.color,
				font: constants.obstacle.font,
				span: constants.obstacle.span,
				life: constants.obstacle.life.min + Math.min(counter, constants.obstacle.life.max - constants.obstacle.life.min),
			});
			counter++;
			this.onCreate.fire(o);
		}, opts.interval);
	}

	/**
	 * Obstacle 生成を取りやめます
	 */
	end(): void {
		this.ended = true;
	}
}

/**
 * Obstacle の初期化に必要なパラメタ
 */
export interface SpawnerOptions {
	/**
	 * 現在のシーン
	 */
	scene: g.Scene;
	/**
	 * 生成したObstacleを描画する親エンティティ
	 */
	container: g.E;
	/**
	 * 生成間隔
	 */
	interval: number;
}
