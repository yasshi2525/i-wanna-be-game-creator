import { sleep } from "./utils";

// 文字切り替え時間
// eslint-disable-next-line @typescript-eslint/naming-convention
const TEXT_VIEW_TIME = 2000;

export class ClosingScene extends g.Scene {
	constructor(opts: g.SceneParameterObject) {
		super(opts);
		this.onLoad.add(() => {
			(async () => {
				const font = new g.DynamicFont({
					game: g.game,
					size: 50,
					fontColor: "black",
					strokeColor: "white",
					strokeWidth: 5,
					fontFamily: "sans-serif",
				});
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 50,
					font,
					text: "ミニゲーム集が簡単に作れる!"
				}));
				await sleep(TEXT_VIEW_TIME);
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 150,
					font,
					text: "ミニゲーム選択マップ、ミニゲーム画面を提供!"
				}));
				await sleep(TEXT_VIEW_TIME);
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 250,
					font,
					text: "ミニゲームのロジック開発に専念できる!"
				}));
				await sleep(TEXT_VIEW_TIME);
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 350,
					font,
					text: "https://github.com/yasshi2525/live-on-air"
				}));
				await sleep(TEXT_VIEW_TIME);
				this.append(new g.Label({
					scene: this,
					x: 50,
					y: 450,
					font,
					text: "yasshi2525/live-on-air でチェキラッ！"
				}));
			})();
		});
	}
}
