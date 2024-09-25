/**
 * Avatar を初期化する際のパラメタ
 */
export interface AvatarOptions {
	/**
	 * 現在の scene
	 */
	scene: g.Scene;
	/**
	 * このエンティティの子としてAvatarを描画します
	 */
	container: g.E;
	/**
	 * 顔画像を左右どちらに配置するか
	 */
	side: "left" | "right";
}

export class Avatar {
	readonly onSpeak = new g.Trigger<string>();
	readonly view: g.E;
	private readonly _face: g.Sprite;
	private readonly _textBackground: g.FilledRect;
	private readonly _text: g.Label;

	constructor({ scene, container, side }: AvatarOptions) {
		this.view = new g.E({
			scene,
			parent: container,
			x: side === "left" ? 100 : g.game.width - 100,
			y: g.game.height - 100
		});

		this._face = new g.Sprite({
			scene,
			parent: this.view,
			src: scene.asset.getImageById("avatar_icon"),
			anchorX: 0.5,
			anchorY: 0.5,
			x: 0,
			y: 0,
			scaleX: 0.25,
			scaleY: 0.25,
		});

		this._textBackground = new g.FilledRect({
			scene,
			parent: this.view,
			anchorX: side === "left" ? 0 : 1,
			anchorY: 0.5,
			x: (side === "left" ? 0.5 : -0.5) * (this._face.width * this._face.scaleX + 20),
			y: 0,
			width: container.width - 200 - (this._face.width * this._face.scaleX + 40) * 2,
			height: 160,
			cssColor: "gray",
			opacity: 0.5,
		});

		this._text = new g.Label({
			scene,
			parent: this.view,
			anchorX: side === "left" ? 0 : 1,
			anchorY: 0.5,
			x: (side === "left" ? 0.5 : -0.5) * (this._face.width * this._face.scaleX + 70),
			y: 0,
			font: new g.DynamicFont({
				game: g.game,
				size: 45,
				strokeColor: "white",
				strokeWidth: 8,
				fontFamily: "sans-serif",
			}),
			text: ""
		});
	}

	hide(): void {
		this.view.hide();
	}

	show(): void {
		this.view.show();
	}

	/**
	 * 顔画像を取得します
	 */
	get face(): g.ImageAsset {
		return this._face.src as g.ImageAsset;
	}

	/**
	 * 顔画像を変更します
	 */
	set face(value: g.ImageAsset) {
		this._face.src = value;
		this._face.invalidate();
	}

	/**
	 * 表示テキストを取得します
	 */
	get text(): string {
		return this._text.text;
	}

	/**
	 * 指定したテキストを表示します
	 */
	set text(value: string) {
		if (value === "") {
			this._textBackground.hide();
		} else {
			this._textBackground.show();
		}
		this._text.text = value;
		this._text.invalidate();
		if (this._text.width > this._textBackground.width - 50) {
			this._text.scaleX = (this._textBackground.width - 50) / this._text.width;
		} else {
			this._text.scaleX = 1;
		}
		this._text.modified();
		this.view.onUpdate.addOnce(() => this.onSpeak.fire(value));
	}
}
