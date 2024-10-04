import { MAX_IDEA, MAX_MOTIVATION } from "../globals";
import { Blaster } from "./blaster";
import { constants } from "./constants";
import { LifeGauge } from "./lifeGauge";
import { Progressor } from "./progressor";
import { Rotator } from "./rotator";
import { Shooter } from "./shooter";
import { Spawner } from "./spawner";
import { Task } from "./task";

/**
 * 開発ミニゲームの全モデル管理＋操作APIを提供
 */
export class GameFacade {
	/**
	 * ゲームが完成(true)/失敗(false)したとき発火します.
	 */
	readonly onComplete = new g.Trigger<boolean>();
	private _status: GameStatus = "developing";

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
	/**
	 * 残りのTask
	 */
	private readonly tasks: Set<Task>;

	constructor({ scene, container, motivation, idea, progress, life, numOfObstacle, taskBounds }: GameFacadeOptions) {
		this.lifeGauge = new LifeGauge({
			scene,
			parent: container,
			initLife: life,
			...constants.lifeGauge,
		});
		this.progressor = new Progressor({
			scene,
			parent: container,
			progress,
			...constants.progressor,
		});
		this.spawner = new Spawner({
			scene,
			container,
			interval: (1 - idea / MAX_IDEA) * constants.spawner.interval.min
				+ (idea / MAX_IDEA) * constants.spawner.interval.max,
			numOfSpawn: numOfObstacle
		});
		this.rotator = new Rotator({
			scene,
			parent: container,
			...constants.rotator,
		});
		this.shooter = new Shooter({
			scene,
			parent: container,
			...constants.shooter,
			interval: motivation / MAX_MOTIVATION * constants.shooter.interval.min
				+ (1 - motivation / MAX_MOTIVATION) * constants.shooter.interval.max,
		});
		this.blaster = new Blaster({
			scene,
			container
		});
		this.tasks = Task.deploy(container, taskBounds);
		for (const t of this.tasks) {
			t.onBreak.add(() => {
				this.progressor.progress(t);
				this.tasks.delete(t);
			});
		}

		let viewedExpireGuide = false;
		// 定期的に障壁発生
		this.spawner.onCreate.add(obstacle => {
			this.lifeGauge.watch(obstacle);
			this.blaster.addObstacle(obstacle);
			// 放置エンティティを検知したらガイドを表示
			obstacle.onWarn.addOnce(() => {
				if (!viewedExpireGuide) {
					const guide = new g.Sprite({
						scene,
						parent: container,
						src: scene.asset.getImageById("obstacle_guide"),
						x: obstacle.x,
						y: obstacle.y,
						anchorX: 0.5,
						anchorY: 1,
						scaleX: 0.5,
						scaleY: 0.5
					});
					scene.setTimeout(() => {
						if (!guide.destroyed()) {
							guide.destroy();
						}
					}, 4000);
					viewedExpireGuide = true;
				}
			});
		});

		// プレイヤー操作で向き変更
		this.rotator.onRotate.add(r => {
			this.shooter.angle = r / Math.PI * 180;
			this.shooter.modified();
		});
		// 定期的に弾射出
		this.shooter.onShoot.add(a => {
			this.blaster.addAttacker(a);
			for (const t of this.tasks) {
				t.watch(a);
			}
		});
		// 弾と障壁がぶつかったら弾消滅
		this.blaster.onDeleteAttacker.add(a => {
			// TODO (?)
		});
		// 残り体力0でゲームオーバー
		this.lifeGauge.onDie.addOnce(() => {
			this._status = "fail";
			this.end();
			this.onComplete.fire(false);
		});
		this.progressor.onComplete.addOnce(() => {
			this._status = "success";
			this.end();
			this.onComplete.fire(true);
		});
	}

	/**
	 * ミニゲームの進行処理を取りやめます
	 */
	end(): void {
		this.lifeGauge.end();
		this.progressor.end();
		this.spawner.end();
		this.rotator.end();
		this.shooter.end();
	}

	/**
	 * 残り体力分のボーナスを発生させます. 残り体力があるかどうかを返します.
	 */
	lifeBonus(): boolean {
		this.lifeGauge.clearLabel();
		return this.lifeGauge.substract(constants.lifeGauge.bonus / constants.lifeGauge.life * constants.lifeGauge.width);
	}

	/**
	 * ゲームの開発状況を取得します.
	 */
	get status(): GameStatus {
		return this._status;
	}

	/**
	 * ゲームの完成度を取得します.
	 */
	get progress(): number {
		return this.progressor.value;
	}
	/**
	 * これまで生成したObstacleの個数を取得します.
	 */
	get numOfObstacle(): number {
		return this.spawner.numOfObstacle;
	}
	/**
	 * 残り体力を取得します.
	 */
	get life(): number {
		return this.lifeGauge.life;
	}

	/**
	 * 残りのTaskの座標を取得します
	 */
	get taskBounds(): Set<g.CommonArea> {
		const taskBounds = new Set<g.CommonArea>();
		for (const t of this.tasks) {
			taskBounds.add({
				x: t.x,
				y: t.y,
				width: t.width,
				height: t.height
			});
		}
		return taskBounds;
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
	/**
	 * やる気。射出速度に影響。0-1.8
	 */
	motivation: number;
	/**
	 * アイデア。障壁の出現率に影響。0-1.8
	 */
	idea: number;
	/**
	 * 前回までの進捗
	 */
	progress: number;
	/**
	 * 前回終了時の残り体力
	 */
	life: number;
	/**
	 * これまで生成したObstacleの数
	 */
	numOfObstacle: number;
	/**
	 * 前回終了時の残りのTaskの座標
	 */
	taskBounds: Set<g.CommonArea>;
}

/**
 * ゲームの開発状況
 *
 * developing: 開発中
 *
 * success: 体力を残した状態で進捗1
 *
 * fail: 進捗が1になる前に体力0
 */
export type GameStatus = "developing" | "success" | "fail";
