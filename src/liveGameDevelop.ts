import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { ContextVars } from "./globals";

/**
 * ゲーム開発をシューティングゲームに模したミニゲーム.
 *
 * 障壁 (Obstacle) が随時発生. 対処に時間がかかるとダメージ.
 * やる気を出して根性 (Shooter による Attacker 射出) で障壁をつぶす.
 * 開発が終了するまで耐える. // TODO
 * やる気が高いと Attacker の頻度Up // TODO
 * アイデアが良いと Attacker の爆発四散時の個数アップ // TODO
 */
export class DevelopLiveGame extends LiveGame {
	private blaster: Blaster;
	private shooter: Shooter;

	protected override handleIntroduction({ scene, container }: LiveContext, next: () => void): (() => void) | void {
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "khaki",
			opacity: 0.5
		}));
		const attacker = {
			color: "green",
			size: 20,
			speed: 4,
		};
		this.blaster = new Blaster({
			scene,
			container,
			attacker
		});
		this.shooter = new Shooter({
			scene,
			container,
			color: "black",
			interval: 250,
			location: { x: container.width / 2, y: container.height - 100 },
			size: 100,
			attacker
		});
		this.shooter.onShoot.add(a => this.blaster.addAttacker(a));
		// 障害物を生成します.
		const opts: ObstacleOptions = {
			scene,
			container,
			color: "gray",
			font: new g.DynamicFont({
				game: g.game,
				size: 50,
				fontFamily: "sans-serif"
			}),
			width: 200,
			height: 100,
		};
		for (let i = 0; i < 5; i++) {
			const obstacle = Obstacle.create(opts);
			this.blaster.obstacles.push(obstacle);
		}
	}
	protected override handleGamePlay(context: LiveContext): (() => void) | void {
		throw new Error("Method not implemented.");
	}
	protected override evaluateScore(context: LiveContext): number {
		throw new Error("Method not implemented.");
	}

	protected override handleResultViewing(context: LiveContext, score: number, next: () => void): (() => void) | void {
		const vars = context.vars as ContextVars;
		vars.onLiveGameResult.fire({ gameType: "develop", score });
		return super.handleResultViewing(context, score, next);
	}
}

/**
 * ゲームの完成を阻止する障害物.
 * TODO: 残り時間とダメージ演出
 */
class Obstacle extends g.FilledRect {

	private static names: string[][] = [
		["動かない"],
		["たまにバグる"],
		["絵心がない"],
		["サウンドを作れない"],
		["唐突なフリーズ"],
		["本当に面白い？", "始まる自問自答"],
		["テストプレイを依頼", "する友人がいない"],
		["人前でおこる", "初めて見るバグ"],
		["バグを直すと", "増えるバグ"],
		["散らかっていく", "ソースコード"],
		["増えていく", "コピー＆ペースト"],
		["コピペしまくったコード", "バグで書き直し発覚"],
		["友人からの", "謎のバグ報告"],
		["最新版が行方不明"],
		["SNSで進捗報告", "説明しづらい"],
		["1ピクセル", "右に動かしたい"],
		["音量ちょっと", "小さいかな"],
		["繰り返すテスト", "ゲームに飽きる"],
		["画像のサイズが", "ちょっと大きい"],
		["難しすぎと", "友人に怒られる"],
		["気づかれない", "隠し要素"],
		["ボタンを連打", "されると恐怖"],
	];

	private static remains: string[][] = [...Obstacle.names];

	private constructor(opts: g.FilledRectParameterObject & {
		font: g.Font;
		name: string[];
	}) {
		super(opts);
		for (let i = 0; i < opts.name.length; i++) {
			const label = new g.Label({
				scene: this.scene,
				parent: this,
				anchorX: 0.5,
				anchorY: 0.5,
				x: this.width / 2,
				y: this.height * (i + 0.5) / opts.name.length,
				font: opts.font,
				text: opts.name[i]
			});
			// はみ出ないように横幅を縮める
			if (label.width > this.width) {
				label.scaleX = this.width / label.width;
				label.modified();
			}
		}
	}

	/**
	 * 障害物を１つ生成します
	 */
	static create({ scene, container, width, height, font, color }: ObstacleOptions): Obstacle {
		if (Obstacle.remains.length === 0) {
			Obstacle.remains = [...Obstacle.names];
		}

		return new Obstacle({
			scene: scene,
			parent: container,
			x: g.game.random.generate() * (container.width - width * 2) + width,
			y: g.game.random.generate() * (container.height - height * 2) + height,
			width: width,
			height: height,
			anchorX: 0.5,
			anchorY: 0.5,
			font: font,
			cssColor: color,
			name: Obstacle.remains.splice(Math.floor(g.game.random.generate() * Obstacle.remains.length), 1)[0]
		});
	}
}

interface ObstacleOptions {
	scene: g.Scene;
	container: g.E;
	font: g.Font;
	width: number;
	height: number;
	color: string;
}

/**
 * Obstacle を倒す攻撃手. ひたすら前進
 */
class Attacker extends g.FilledRect {
	readonly onOut = new g.Trigger<Attacker>();
	readonly direction: g.CommonOffset;

	private constructor(opts: g.FilledRectParameterObject & {
		area: g.CommonRect;
		direction: g.CommonOffset;
	}) {
		super(opts);
		this.direction = { ...opts.direction };
		this.angle = Math.atan2(this.direction.y, this.direction.x) / Math.PI * 180;
		this.modified();
		this.onUpdate.add(() => {
			this.x += this.direction.x;
			this.y += this.direction.y;
			this.modified();
			if (this.x < opts.area.left || this.x > opts.area.right || this.y < opts.area.top || this.y > opts.area.bottom) {
				this.destroy();
				this.onOut.fire(this);
				return true;
			}
		});
	}

	static create({ scene, container, speed, color, size, theta, location }: AttackOption): Attacker {
		return new Attacker({
			scene,
			parent: container,
			area: {
				left: 0,
				right: container.width,
				top: 0,
				bottom: container.height,
			},
			direction: {
				x: Math.cos(theta) * speed,
				y: Math.sin(theta) * speed,
			},
			x: location.x,
			y: location.y,
			width: size,
			height: size,
			cssColor: color,
		});
	}
}

interface AttackOption {
	scene: g.Scene;
	container: g.E;
	speed: number;
	color: string;
	size: number;
	theta: number;
	location: g.CommonOffset;
}

/**
 * Attacker が Obstascle にあたったら爆発四散させる
 */
class Blaster {
	readonly onDeleteObstacle = new g.Trigger<Obstacle>();
	readonly onDeleteAttacker = new g.Trigger<Attacker>();
	readonly onCreateAttacker = new g.Trigger<Attacker>();
	readonly obstacles: Obstacle[] = [];
	readonly attackers: Attacker[] = [];

	constructor({ scene, container, attacker: { speed, size, color } }: BlasterOption) {
		container.onUpdate.add(() => {
			const attackers = [...this.attackers.filter(a => !a.destroyed())];
			for (const attacker of attackers) {
				const obstacles = [...this.obstacles.filter(o => !o.destroyed())];
				for (const obstacle of obstacles) {
					const area = obstacle.calculateBoundingRect();
					if (attacker.x >= area.left && attacker.x <= area.right && attacker.y >= area.top && attacker.y <= area.bottom) {
						const theta = Math.atan2(attacker.direction.y, attacker.direction.x);
						for (const subAttacker of [-1 / 6 * Math.PI, 1 / 6 * Math.PI].map(dt => Attacker.create({
							scene,
							container,
							speed,
							color,
							size,
							theta: theta + dt,
							location: { x: attacker.x, y: attacker.y }
						}))) {
							this.addAttacker(subAttacker);
						}

						obstacle.destroy();
						this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
						this.onDeleteObstacle.fire(obstacle);
						attacker.destroy();
						this.attackers.splice(this.attackers.indexOf(attacker), 1);
						this.onDeleteAttacker.fire(attacker);
					}
				}
			}
		});
	}

	addAttacker(attacker: Attacker): void {
		attacker.onOut.addOnce(a => {
			this.attackers.splice(this.attackers.indexOf(a), 1);
		});
		this.attackers.push(attacker);
	}
}

interface BlasterOption {
	scene: g.Scene;
	container: g.E;
	attacker: {
		speed: number;
		color: string;
		size: number;
	};
}

/**
 * ひたすら自身の向きに Attacker を生成
 * // TODO 回転
 */
class Shooter extends g.FilledRect {
	readonly onShoot = new g.Trigger<Attacker>();

	constructor({ scene, container, interval, size, color, location, attacker }: ShooterOptions) {
		super({
			scene,
			parent: container,
			x: location.x,
			y: location.y,
			width: size,
			height: size,
			anchorX: 0.5,
			anchorY: 0.5,
			cssColor: color
		});
		let duration = 0;
		this.onUpdate.add(() => {
			this.angle += 10;
			if (duration > interval) {
				const a = Attacker.create({
					scene,
					container,
					speed: attacker.speed,
					color: attacker.color,
					size: attacker.size,
					theta: this.angle / 180 * Math.PI,
					location: { x: this.x, y: this.y }
				});
				this.onShoot.fire(a);
				duration -= interval;
			}
			duration += 1000 / g.game.fps;
		});
	}
}

interface ShooterOptions {
	scene: g.Scene;
	container: g.E;
	interval: number;
	size: number;
	color: string;
	location: g.CommonOffset;
	attacker: {
		speed: number;
		color: string;
		size: number;
	};
}
