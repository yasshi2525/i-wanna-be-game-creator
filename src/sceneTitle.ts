import {
	BroadcasterBuilder,
	CommentCondition,
	CommentContextSupplier,
	CommentDeployerBuilder,
	CommentSupplierBuilder
} from "@yasshi2525/live-on-air";
import { Avatar } from "./avatar";
import { Frame } from "./frame";
import { TEXT_VIEW_TIME } from "./globals";
import { createMainScene } from "./sceneMain";
import { sleep, toCommentSchema } from "./utils";

export class TitleScene extends g.Scene {
	private remainFrame: number;

	constructor(opts: g.SceneParameterObject & {
		/**
		 * 制限時間
		 */
		totalTimeLimit: number;
	}) {
		super(opts);
		this.remainFrame = opts.totalTimeLimit * g.game.fps;
		this.onUpdate.add(() => {
			this.remainFrame--;
		});
		this.onLoad.add(() => {
			// 表示順序（数字が大きいほど上）
			// 1. commentFrame コメント表示用枠
			// 2. commentArea  コメント本文
			// 3. overlayArea  タイトル・生主アバター表示用

			const commentFrame = new Frame({
				scene: this,
				parent: this,
				x: 95,
				y: 145,
				width: g.game.width - 180,
				height: g.game.height - 380,
				strokeWidth: 5,
				strokeColor: "black",
				fillColor: "white",
				fillOpacity: 0.5,
				hidden: true
			});
			const commentArea = new g.Pane({
				scene: this,
				parent: this,
				x: 100,
				y: 150,
				width: g.game.width - 190,
				height: g.game.height - 390,
				hidden: true
			});
			const overlayArea = new g.E({
				scene: this,
				parent: this,
				width: g.game.width,
				height: g.game.height
			});

			// 画面にコメントを表示させる（初期化処理）

			const contextSupplier = new CommentContextSupplier({
				broadcaster: new BroadcasterBuilder(this).build(),
				field: undefined,
				screen: undefined,
				vars: contextVars
			});

			const commentSupplier = new CommentSupplierBuilder(this)
				.comments(toCommentSchema(
					["放送ｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!", isWelocome],
					["はいどうもね", isWelocome],
					["ゲーム制作配信ｋｔｋｒ", isWelocome],
					["進捗どうですか？", isWelocome],
					["ズコーッ", isDecideToDevelop],
					["まだ作ってなかったんかいｗ", isDecideToDevelop],
					["順調そうで何より", isDecideToDevelop],
					["はよやれｗｗｗ", isDecideToDevelop],
					["生制作ｋｔｋｒ", isDecideToDevelop]
				))
				.build();

			const commentDeployer = new CommentDeployerBuilder(this)
				.speed(8)
				.build();
			commentDeployer.container = commentArea;
			commentSupplier.addDeployer(commentDeployer);


			// タイトルと生主のセリフの描画
			const broadcaster = new Avatar({ scene: this, container: overlayArea, side: "left" });
			(async () => {
				// コメント描画開始
				commentFrame.show();
				commentArea.show();
				commentSupplier.start(contextSupplier);
				broadcaster.text = "どぅも～";
				await sleep(TEXT_VIEW_TIME);
				broadcaster.text = "ゲーム制作系配信者でぇ～す！";
				await sleep(TEXT_VIEW_TIME);
				broadcaster.text = "今からゲームつくるでぇ～す！";
				contextVars.stage = "decide-to-develop";
				await sleep(TEXT_VIEW_TIME);
				// タイトル描画開始
				const title = new g.Label({
					scene: this,
					font: new g.DynamicFont({
						game: g.game,
						size: 70,
						fontFamily: "sans-serif",
						fontColor: "black",
						strokeColor: "white",
						strokeWidth: 10,
					}),
					text: "今からでも作れる生ゲがあるんですか??",
				});
				overlayArea.append(title);
				await sleep(TEXT_VIEW_TIME * 1.5);
				g.game.pushScene(createMainScene({ totalTimeLimit: this.remainFrame / g.game.fps }));
			})();

		});
	}
}

type ContextVars = {
	stage: "welcome" | "decide-to-develop";
};
const isWelocome: CommentCondition = ctx => (ctx.vars as ContextVars).stage === "welcome";
const isDecideToDevelop: CommentCondition = ctx => (ctx.vars as ContextVars).stage === "decide-to-develop";
const contextVars: ContextVars = { stage: "welcome" };
