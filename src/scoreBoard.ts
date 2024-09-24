import { ContextVars } from "./globals";

/**
 * ミニゲームの結果もらえるパラメタを表示
 */
export class ScoreBoard extends g.E {
	private readonly motivation: ParameterView;
	private readonly idea: ParameterView;
	private readonly model: ContextVars;

	constructor(opts: g.EParameterObject & {
		font: g.Font;
		model: ContextVars;
	}) {
		super(opts);
		this.model = opts.model;
		this.motivation = new ParameterView({
			scene: this.scene,
			parent: this,
			font: opts.font,
			name: "やる気　",
			width: opts.width
		});
		this.idea = new ParameterView({
			scene: this.scene,
			parent: this,
			font: opts.font,
			name: "アイデア",
			y: opts.font.size * 2,
			width: opts.width
		});
	}

	/**
	 * パラメタに変化があったことを通知し、表示を最新にします.
	 */
	notify(): void {
		this.motivation.value = this.model.motivation;
		this.idea.value = this.model.idea;
	}
}

class ParameterView extends g.E {
	private _value: number;
	private background: g.FilledRect;
	private name: string;
	private label: g.Label;

	constructor(opts: g.EParameterObject & {
		font: g.Font;
		name: string;
	}) {
		super(opts);
		this.background = new g.FilledRect({
			scene: this.scene,
			parent: this,
			cssColor: "gray",
			x: -opts.font.size * 0.125,
			y: -opts.font.size * 0.125,
			width: opts.width,
			height: opts.font.size * 1.5,
			opacity: 0.5,
			hidden: true
		});
		this.label = new g.Label({
			scene: this.scene,
			parent: this,
			font: opts.font,
			text: "",
			hidden: true
		});
		this.name = opts.name;
	}

	get value(): number {
		return this._value;
	}

	set value(v: number) {
		this._value = v;
		if (this._value === 0) {
			this.background.hide();
			this.label.hide();
		} else {
			this.background.show();
			this.label.show();
		}
		this.label.text = this.name + ":" + this.toViewString(this._value);
		this.label.invalidate();
	}

	toViewString(v: number): string {
		if (v >= 1.8) {
			return "✔✔✔";
		}
		if (v >= 0.9) {
			return " ✔✔";
		}
		return "  ✔";
	}
}
