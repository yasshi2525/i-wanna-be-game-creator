export interface AvatarOptions {
	scene: g.Scene;
	/**
	 * このエンティティの子としてAvatarを描画します
	 */
	container: g.E;
	side: "left" | "right";
}

export class Avatar {
	readonly onSpeak = new g.Trigger<string>();
	readonly view: g.E;
	private readonly face: g.FilledRect;
	private readonly _text: g.Label;

	constructor({ scene, container, side }: AvatarOptions) {
		this.view = new g.E({
			scene,
			parent: container,
			x: side === "left" ? 100 : g.game.width - 100,
			y: g.game.height - 200
		});
		this.face = new g.FilledRect({
			scene,
			parent: this.view,
			anchorX: 0.5,
			anchorY: 0.5,
			x: 0,
			y: 0,
			width: 100,
			height: 100,
			cssColor: "#883333"
		});
		this._text = new g.Label({
			scene,
			parent: this.view,
			anchorX: side === "left" ? 0 : 1,
			anchorY: 0.5,
			x: (side === "left" ? 0.5 : -0.5) * (this.face.width + 20),
			y: 0,
			font: new g.DynamicFont({
				game: g.game,
				size: 45,
				strokeColor: "white",
				strokeWidth: 4,
				fontFamily: "sans-serif",
			}),
			text: ""
		});
	}

	get text(): string {
		return this._text.text;
	}

	set text(value: string) {
		this._text.text = value;
		this._text.invalidate();
		this.view.onUpdate.addOnce(() => this.onSpeak.fire(value));
	}
}
