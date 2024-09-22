import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { INTERVAL_TIME, TEXT_VIEW_TIME } from "./globals";
import { sleep } from "./utils";

/**
 * やる気を出すゲーム
 */
export class MotivationLiveGame extends LiveGame {
	protected speech: g.Label;
	protected gauge: g.FilledRect;

	protected override handleIntroduction({ scene, container }: LiveContext, next: () => void): (() => void) | void {
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "yellow",
			opacity: 0.75
		}));
		this.speech = new g.Label({
			scene,
			parent: container,
			x: 50,
			y: container.height - 50,
			anchorY: 1,
			font: new g.DynamicFont({ game: g.game, fontFamily: "sans-serif", size: 40 }),
			text: "まずはやる気を出さなきゃな"
		});

		(async () => {
			await sleep(TEXT_VIEW_TIME);
			next();
		})();
	}
	protected override handleGamePlay({ scene, container }: LiveContext): (() => void) | void {
		this.gauge = new g.FilledRect({
			scene,
			parent: container,
			y: container.height / 2,
			anchorY: 0.5,
			width: 0,
			height: 100,
			cssColor: "brown",
		});
		const updateHandler = (): void => {
			this.gauge.width += 10;
			if (this.gauge.width > container.width) {
				this.gauge.width = 0;
			}
			this.gauge.modified();
		};
		this.gauge.onUpdate.add(updateHandler);
		this.onSubmit.addOnce(() => this.gauge.onUpdate.remove(updateHandler));
		const tweet = async (): Promise<void> => {
			await sleep(INTERVAL_TIME);
			this.speech.text = "やる気でない…";
			this.speech.invalidate();
			await sleep(INTERVAL_TIME);
			this.speech.text = "今は時期が悪い…";
			this.speech.invalidate();
			await sleep(INTERVAL_TIME);
			this.speech.text = "明日からにしようかな…";
			this.speech.invalidate();
			await sleep(INTERVAL_TIME);
			this.speech.text = "コーヒーでも飲むか…";
			this.speech.invalidate();
			await sleep(INTERVAL_TIME);
			this.speech.text = "あっ、推しの配信始まった";
			this.speech.invalidate();
			await sleep(INTERVAL_TIME);
			this.speech.text = "生ゲやったら始めるか…";
			this.speech.invalidate();
			await tweet();
		};
		tweet();
	}
	protected override evaluateScore({ container }: LiveContext): number {
		return this.gauge.width / container.width * 100;
	}

}
