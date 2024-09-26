import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { Frame } from "./frame";
import { ContextVars, MAX_MOTIVATION, TEXT_VIEW_TIME, TWEET_VIEW_TIME } from "./globals";
import { sleep } from "./utils";

/**
 * やる気を出すゲーム
 */
export class MotivationLiveGame extends LiveGame {
	override unlockThreshold = 0;
	private speech: g.Label;
	private gauge: Frame;
	private static speechFont = new g.DynamicFont({ game: g.game, fontFamily: "sans-serif", size: 40 });

	protected override handleIntroduction({ scene, container }: LiveContext, next: () => void): (() => void) | void {
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "khaki",
			opacity: 0.75
		}));
		container.append(new g.FilledRect({
			scene,
			parent: container,
			x: container.width / 2,
			y: container.height - 75,
			width: container.width * 0.5,
			height: 50,
			anchorX: 0.5,
			cssColor: "white",
			opacity: 0.5
		}));
		this.speech = new g.Label({
			scene,
			parent: container,
			x: container.width / 2,
			y: container.height - 75,
			width: container.width * 0.5,
			height: 50,
			anchorX: 0.5,
			font: MotivationLiveGame.speechFont,
			text: "まずはやる気を出さなきゃな"
		});

		(async () => {
			await sleep(TEXT_VIEW_TIME);
			next();
		})();
	}
	protected override handleGamePlay({ scene, container, vars }: LiveContext): (() => void) | void {
		this.gauge = new Frame({
			scene,
			parent: container,
			x: container.width / 2,
			y: container.height / 2 + 50,
			anchorX: 0.5,
			anchorY: 0.5,
			width: g.game.width / 2,
			height: 85,
			strokeColor: "black",
			strokeWidth: 5,
			fillColor: "firebrick",
			fillOpacity: 1,
		});
		this.gauge.body.width = 0;
		this.gauge.body.modified();
		const updateHandler = (): void => {
			if (this.gauge.body.width >= this.gauge.width - 10) {
				this.gauge.body.width = 0;
			}
			// やる気が高いほどさらなるやる気上げを難しくするため、バーが伸びる速度をあげる
			this.gauge.body.width += 10 * Math.max(1, (vars as ContextVars).motivation);
			if (this.gauge.body.width > this.gauge.width - 10) {
				this.gauge.body.width = this.gauge.width - 10;
			}
			this.gauge.modified();
		};
		this.gauge.onUpdate.add(updateHandler);
		this.onSubmit.addOnce(() => this.gauge.onUpdate.remove(updateHandler));
		const tweet = async (): Promise<void> => {
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "やる気でない…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "今は時期が悪い…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "明日からにしようかな…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "コーヒーでも飲むか…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "あっ、推しの配信始まった";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "生ゲやったら始めるか…";
			this.speech.invalidate();
			await tweet();
		};
		tweet();
	}

	protected override handleSubmit({ scene, container }: LiveContext, next: () => void): (() => void) | void {
		const button = new g.Sprite({
			scene,
			parent: container,
			src: scene.asset.getImageById("submit"),
			x: container.width / 2,
			y: 25,
			anchorX: 0.5,
			touchable: true
		});
		button.onPointDown.add(() => {
			button.hide();
			next();
		});
		return () => {
			button.destroy();
		};
	}

	protected override evaluateScore({ container }: LiveContext): number {
		return this.gauge.body.width / (this.gauge.width - 10) * 100;
	}

	protected override handleResultViewing(context: LiveContext, score: number, next: () => void): (() => void) | void {
		const vars = context.vars as ContextVars;
		vars.onLiveGameResult.fire({ gameType: "motivation", score });
		vars.motivation = Math.min(vars.motivation + score / 100, MAX_MOTIVATION);
		return super.handleResultViewing(context, score, next);
	}
}
