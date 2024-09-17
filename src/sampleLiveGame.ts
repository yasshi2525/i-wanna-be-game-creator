import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";

/**
 * サンプルミニゲームです. ゲージが最大までたまったタイミングでボタンを押下するゲームです.
 *
 * @inheritDoc
 */
export class SampleLiveGame extends LiveGame {
	readonly font = new g.DynamicFont({
		game: g.game,
		fontFamily: "sans-serif",
		size: 50,
		strokeColor: "white",
		strokeWidth: 4
	});

	/**
	 * ゲーム概要を説明します.
	 *
	 * @protected
	 * @inheritDoc
	 */
	protected handleIntroduction (context: LiveContext, next: () => void): () => void {
		const { scene, container } = { ...context };
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "#ffffaa",
			opacity: 0.25
		}));
		const description = new g.Label({
			scene,
			parent: container,
			text: "ゲージの最大値でボタンを押そう！",
			font: this.font
		});
		// 3秒間表示したあと、次のステップに移行します
		scene.setTimeout(() => next(), 3000);
		// 戻り値にクリーンアップ処理を定義することで、3秒経過後、次のステップに移行する前に描画内容を削除できます
		return () => {
			description.destroy();
		};
	}

	/**
	 * ミニゲーム本編.
	 *
	 * ゲージを伸ばし、最大まで伸び切ったら 0 に戻す... を繰り返します.
	 *
	 * ユーザーが押下するボタンは自動で挿入されます. カスタマイズしたい場合、 {@link handleSubmit} メソッドをオーバーライドしてください.
	 *
	 * @param context 利用可能な環境情報
	 * @protected
	 * @inheritDoc
	 */
	protected handleGamePlay (context: LiveContext): () => void {
		const { scene, container } = { ...context };
		const gauge = new g.FilledRect({
			scene,
			parent: container,
			width: 0,
			height: 100,
			cssColor: "#aa4444",
			y: container.height / 2,
			anchorY: 0.5
		});
		// ゲージの幅を得点計算に用いるので context の一時領域に gauge を登録します.
		context.vars = { gauge };
		// ゲージを伸ばしていき、最大まで伸び切ったら 0 に戻します.
		gauge.onUpdate.add(() => {
			gauge.width += container.width / 120;
			if (gauge.width > container.width) {
				gauge.width = 0;
			}
			gauge.modified();
		});
		// 戻り値にクリーンアップ処理を定義することで、次のステップに移行する前に描画内容を削除できます
		return () => {
			gauge.destroy();
		};
	}

	/**
	 * ゲージの長さをもとに得点を算出します. 100点満点
	 * @inheritDoc
	 */
	protected evaluateScore (context: LiveContext): number {
		return (context.vars as Record<string, g.FilledRect>).gauge.width / context.container.width * 100;
	}
}
