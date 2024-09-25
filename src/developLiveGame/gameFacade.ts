import { Blaster } from "./blaster";
import { constants } from "./constants";
import { LifeGauge } from "./lifeGauge";
import { Progressor } from "./progressor";
import { Rotator } from "./rotator";
import { Shooter } from "./shooter";
import { Spawner } from "./spawner";

/**
 * 開発ミニゲームの全モデル管理＋操作APIを提供
 */
export class GameFacade {
	/**
	 * 残り体力
	 */
	private readonly lifeGauge: LifeGauge;
	/**
	 * ゲームの進捗. 完成度
	 */
	private readonly progressor: Progressor;
	/**
	 * 障壁をつくる
	 */
	private readonly spawner: Spawner;
	/**
	 * プレイヤー操作で自機の向きを変える
	 */
	private readonly rotator: Rotator;
	/**
	 * 自機の向きに弾を発射
	 */
	private readonly shooter: Shooter;
	/**
	 * 弾と障壁がぶつかった際、弾を消去
	 */
	private readonly blaster: Blaster;

	constructor({ scene, container }: GameFacadeOptions) {
		this.lifeGauge = new LifeGauge({
			scene,
			parent: container,
			...constants.lifeGauge
		});
		this.progressor = new Progressor({
			scene,
			parent: container,
			...constants.progressor,
		});
		this.spawner = new Spawner({
			scene,
			container,
			interval: constants.spaner.interval
		});
		this.rotator = new Rotator({
			scene,
			parent: container,
			...constants.rotator,
		});
		this.shooter = new Shooter({
			scene,
			parent: container,
			...constants.shooter
		});
		this.blaster = new Blaster({
			scene,
			container
		});
		// 定期的に障壁発生
		this.spawner.onCreate.add(obstacle => {
			this.lifeGauge.watch(obstacle);
			this.blaster.addObstacle(obstacle);
		});
		// プレイヤー操作で向き変更
		this.rotator.onRotate.add(r => {
			this.shooter.angle = r / Math.PI * 180;
			this.shooter.modified();
		});
		// 定期的に弾射出
		this.shooter.onShoot.add(a => {
			this.blaster.addAttacker(a);
			a.onOut.add(() => {
				this.progressor.progress();
			});
		});
		// 弾と障壁がぶつかったら弾消滅
		this.blaster.onDeleteAttacker.add(a => {
			// TODO (?)
		});
		// 残り体力0でゲームオーバー
		this.lifeGauge.onDie.addOnce(() => {
			this.end();
		});
		this.progressor.onComplete.addOnce(() => {
			this.end();
		});
	}

	/**
	 * ミニゲームの進行処理を取りやめます
	 */
	end(): void {
		this.spawner.end();
		this.rotator.end();
		this.shooter.end();
	}
}

/**
 * 初期化に必要なパラメタ
 */
export interface GameFacadeOptions {
	/**
	 * 現在のシーン
	 */
	scene: g.Scene;
	/**
	 * 描画対象の親となるエンティティ
	 */
	container: g.E;
}
