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
	private readonly sensor: g.FilledRect;
	/**
	 * 自機が向いている方向を示す線
	 */
	private readonly direction: g.FilledRect;

	constructor(opts: RotatorOptions) {
		super(opts);
		this.sensor = new g.FilledRect({
			scene: this.scene,
			parent: this,
			width: this.width,
			height: this.height,
			anchorY: 0.5,
			cssColor: opts.color,
			touchable: true,
		});
		this.direction = new g.FilledRect({
			scene: this.scene,
			parent: this,
			width: this.width,
			height: 1,
			cssColor: "black",
		});
		this.sensor.onPointDown.add(e => this.rotateTo(e.point));
		this.sensor.onPointMove.add(e => this.rotateTo({ x: e.point.x + e.startDelta.x, y: e.point.y + e.startDelta.y }));
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
export interface RotatorOptions extends g.EParameterObject {
	/**
	 * 操作受付領域の色
	 */
	color: string;
}
