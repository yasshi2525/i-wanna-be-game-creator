
export class PR extends g.Sprite {
	constructor(opts: g.SpriteParameterObject) {
		super(opts);
		const monoFontOption: g.DynamicFontParameterObject = {
			game: g.game,
			fontFamily: "monospace",
			size: 22,
		};
		const terminalFont = new g.DynamicFont({
			...monoFontOption,
			fontColor: "white"
		});
		const terminal = new g.FilledRect({
			scene: this.scene,
			parent: this,
			x: this.width / 2,
			y: this.height * 0.6,
			width: this.width * 0.9,
			height: 30,
			anchorX: 0.5,
			anchorY: 0.5,
			cssColor: "black",
		});
		terminal.append(new g.Label({
			scene: this.scene,
			font: terminalFont,
			x: terminal.width / 2,
			y: terminal.height / 2,
			anchorX: 0.5,
			anchorY: 0.5,
			text: "akashic init -t github:yasshi2525/live-on-air-template"
		}));
		const urlFont = new g.DynamicFont({
			...monoFontOption,
			size: 18
		});
		this.append(new g.Sprite({
			scene: this.scene,
			src: this.scene.asset.getImageById("yasshi2525"),
			x: this.width * 0.05,
			y: this.height * 0.95 - 30,
			anchorY: 1,
			scaleX: 0.5,
			scaleY: 0.5,
		}));
		this.append(new g.Label({
			scene: this.scene,
			font: urlFont,
			text: "やっしー",
			x: this.width * 0.15,
			y: this.height * 0.8,
			anchorY: 0.5
		}));
		this.append(new g.Label({
			scene: this.scene,
			font: urlFont,
			text: "https://x.com/yasshi2525",
			x: this.width * 0.05,
			y: this.height * 0.95,
			anchorY: 1
		}));
		this.append(new g.Sprite({
			scene: this.scene,
			src: this.scene.asset.getImageById("live_on_air"),
			x: this.width * 0.95,
			y: this.height * 0.95 - 25,
			anchorX: 1,
			anchorY: 1,
			scaleX: 0.25,
			scaleY: 0.25,
		}));
		this.append(new g.Label({
			scene: this.scene,
			font: urlFont,
			text: "https://github.com/yasshi2525/live-on-air",
			x: this.width * 0.95,
			y: this.height * 0.95,
			anchorX: 1,
			anchorY: 1
		}));
	}
}
