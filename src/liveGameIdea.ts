import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { ContextVars, MAX_IDEA, TEXT_VIEW_TIME, TWEET_VIEW_TIME } from "./globals";
import { sleep } from "./utils";

/**
 * アイデア表示の最大値
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const MAX_IDEA_SIZE = 200;
type Direction = "expand" | "shrink";

/**
 * アイデアを出すゲーム
 */
export class IdeaLiveGame extends LiveGame {
	override unlockThreshold = 0;
	private speech: g.Label;
	private idea: g.FilledRect;

	protected override handleIntroduction({ container, scene }: LiveContext, next: () => void): (() => void) | void {
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
			text: "どんなゲームにしようかな"
		});

		(async () => {
			await sleep(TEXT_VIEW_TIME);
			next();
		})();
	}
	protected override handleGamePlay({ container, scene, broadcaster, vars }: LiveContext): (() => void) | void {
		this.idea = new g.FilledRect({
			scene,
			parent: container,
			x: container.width / 4,
			y: container.height / 2,
			anchorX: 0.5,
			anchorY: 0.5,
			width: 0,
			height: 0,
			opacity: 0,
			cssColor: "brown",
		});
		let sizeDirection: Direction = "expand";
		let opacityDirection: Direction = "expand";
		const updateHandler = (): void => {
			// やる気・アイデアの値が高いほど、速度アップで難しくなる
			const multiply = Math.max(1, (vars as ContextVars).motivation) + Math.max(1, (vars as ContextVars).idea);
			this.idea.height += 5 * multiply * (sizeDirection === "expand" ? 1 : -1);
			this.idea.width += 5 * multiply * (sizeDirection === "expand" ? 1 : -1);
			this.idea.opacity += 0.01 * multiply * (opacityDirection === "expand" ? 1 : -1);
			if (this.idea.width > MAX_IDEA_SIZE) {
				this.idea.width = MAX_IDEA_SIZE;
				sizeDirection = "shrink";
			}
			if (this.idea.height > MAX_IDEA_SIZE) {
				this.idea.height = MAX_IDEA_SIZE;
				sizeDirection = "shrink";
			}
			if (this.idea.width < 0) {
				this.idea.width = 0;
				sizeDirection = "expand";
			}
			if (this.idea.height < 0) {
				this.idea.height = 0;
				sizeDirection = "expand";
			}
			if (this.idea.opacity > 1) {
				this.idea.opacity = 1;
				opacityDirection = "shrink";
			}
			if (this.idea.opacity < 0) {
				this.idea.opacity = 0;
				opacityDirection = "expand";
			}
			this.idea.modified();
		};
		this.idea.onUpdate.add(updateHandler);
		this.onSubmit.addOnce(() => this.idea.onUpdate.remove(updateHandler));
		const tweet = async (): Promise<void> => {
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "うーん…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "何かないかなぁ…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "お風呂入って目を覚ますか…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "5分だけ寝ようか…";
			this.speech.invalidate();
			await sleep(TWEET_VIEW_TIME);
			this.speech.text = "明日からにしようか…";
			this.speech.invalidate();
			await tweet();
		};
		tweet();
	}
	protected override evaluateScore(context: LiveContext): number {
		return this.idea.width / MAX_IDEA_SIZE * this.idea.height / MAX_IDEA_SIZE * this.idea.opacity * 100;
	}

	protected override toResultText(context: LiveContext, score: number): string {
		if (score >= 75) {
			return "エクセレント";
		}
		if (score >= 50) {
			return "グレイト！";
		}
		if (score >= 25) {
			return "グッド！";
		}
		return "ミス…";
	}

	protected override handleResultViewing(context: LiveContext, score: number, next: () => void): (() => void) | void {
		const vars = context.vars as ContextVars;
		vars.idea = Math.min(vars.idea + score / 100, MAX_IDEA);
		return super.handleResultViewing(context, score, next);
	}
}
