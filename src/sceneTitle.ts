import { createMainScene } from "./sceneMain";
import { sleep } from "./utils";

// 画像切り替えなどの短い時間
// eslint-disable-next-line @typescript-eslint/naming-convention
const INTERVAL_TIME = 500;
// 文字切り替え時間
// eslint-disable-next-line @typescript-eslint/naming-convention
const TEXT_VIEW_TIME = 2000;

export class TitleScene extends g.Scene {
	constructor(opts: g.SceneParameterObject & {
		totalTimeLimit: number;
	}) {
		super({ ...opts, assetIds: ["avatar_icon"], name: "title" });
		this.onLoad.add(() => {
			(async () => {
				await sleep(INTERVAL_TIME);
				const titleFont = new g.DynamicFont({
					game: g.game,
					size: 66,
					fontColor: "black",
					strokeColor: "white",
					strokeWidth: 5,
					fontFamily: "sans-serif",
				});
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 50,
					font: titleFont,
					text: "今からでも作れる生ゲがあるんですか??"
				}));
				await sleep(TEXT_VIEW_TIME);
				this.append(new g.Sprite({
					scene: this,
					src: this.asset.getImageById("avatar_icon"),
					x: 100,
					y: g.game.height - 100,
					anchorX: 0.5,
					anchorY: 0.5,
					scaleX: 0.25,
					scaleY: 0.25,
				}));
				await sleep(INTERVAL_TIME);
				const speechFont = new g.DynamicFont({
					game: g.game,
					fontColor: "black",
					strokeColor: "white",
					strokeWidth: 4,
					size: 50,
					fontFamily: "sans-serif",
				});
				const beginner = new g.Label({
					scene: this,
					parent: this,
					font: speechFont,
					x: 250,
					y: g.game.height - 100,
					width: g.game.width - 250,
					anchorY: 0.5,
					text: "どぅも～！ゲーム制作生主でぇ～す！"
				});
				await sleep(TEXT_VIEW_TIME);
				beginner.text = "ゲーム制作って何するのぉ？";
				beginner.invalidate();
				await sleep(TEXT_VIEW_TIME);
				beginner.text = "";
				beginner.invalidate();
				this.append(new g.Sprite({
					scene: this,
					src: this.asset.getImageById("avatar_icon"),
					x: g.game.width - 100,
					y: g.game.height - 100,
					anchorX: 0.5,
					anchorY: 0.5,
					scaleX: 0.25,
					scaleY: 0.25,
				}));
				await sleep(INTERVAL_TIME);
				const guide = new g.Label({
					scene: this,
					parent: this,
					font: speechFont,
					y: g.game.height - 100,
					width: g.game.width - 250,
					textAlign: "right",
					widthAutoAdjust: false,
					anchorY: 0.5,
					text: "そんなアナタにオススメします！"
				});
				await sleep(TEXT_VIEW_TIME);
				guide.text = "";
				guide.invalidate();
				beginner.text = "やっふぅぅう!!!";
				beginner.invalidate();
				await sleep(TEXT_VIEW_TIME);
				const descriptionFont = new g.DynamicFont({
					game: g.game,
					size: 40,
					fontColor: "black",
					strokeColor: "white",
					strokeWidth: 5,
					fontFamily: "sans-serif"
				});
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 200,
					font: descriptionFont,
					text: "ミニゲーム集の制作をお手伝いするゲームテンプレートのご紹介"
				}));
				await sleep(TEXT_VIEW_TIME);
				g.game.pushScene(createMainScene(opts.totalTimeLimit));
			})();

		});
	}
}
