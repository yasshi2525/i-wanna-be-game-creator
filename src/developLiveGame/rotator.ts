/**
 * プレイヤーの操作入力を受け付け Shooter の向きを変える、
 */
export class Rotator extends g.E {
	/**
	 * プレイヤー操作により自機回転が生じた際に発火. 単位ラジアン
	 */
	readonly onRotate = new g.Trigger<number>();
	/**
	 * プレイヤーの操作入力受付領域
	 */
	private readonly sensor: g.E;
	/**
	 * 自機が向いている方向を示す線
	 */
	private readonly direction: g.Sprite;

	constructor(opts: RotatorOptions) {
		super(opts);
		const parent = opts.parent as g.E;
		const sensorArea: g.CommonRect = {
			left: parent.x,
			right: parent.x + parent.width,
			top: parent.y,
			bottom: parent.y + parent.height,
		};
		this.sensor = new g.E({
			scene: this.scene,
			parent: this,
			x: sensorArea.left,
			y: sensorArea.top,
			width: sensorArea.right - sensorArea.left,
			height: sensorArea.bottom - sensorArea.top,
			anchorY: 0.5,
			touchable: true
		});
		this.append(new g.Sprite({
			scene: this.scene,
			parent: this,
			src: this.scene.asset.getImageById("rotate_guide"),
			anchorY: 0.5
		}));
		this.direction = new g.Sprite({
			scene: this.scene,
			parent: this,
			anchorY: 0.5,
			src: this.scene.asset.getImageById("direction")
		});
		this.sensor.onPointDown.add(e => this.rotateTo({
			x: Math.max(1, e.point.x),
			y: e.point.y - this.sensor.height / 2
		}));
		this.sensor.onPointMove.add(e => this.rotateTo({
			x: Math.max(1, e.point.x + e.startDelta.x),
			y: e.point.y + e.startDelta.y - this.sensor.height / 2
		}));
	}

	end(): void {
		this.sensor.touchable = false;
	}

	/**
	 * 自機を引数の向きに向ける
	 */
	private rotateTo(p: g.CommonOffset): void {
		const d = { x: p.x + 1, y: p.y - this.height / 2 };
		const theta = Math.atan2(d.y, d.x);

		this.direction.angle = theta / Math.PI * 180;
		this.direction.modified();

		this.onRotate.fire(theta);
	}

}

/**
 * Rotatorを初期化する際のパラメタ
 */
export interface RotatorOptions extends g.EParameterObject { }
