import { LiveContext, LiveGame } from "@yasshi2525/live-on-air";
import { ContextVars, MAX_IDEA, TEXT_VIEW_TIME, TWEET_VIEW_TIME } from "./globals";
import { play, sleep } from "./utils";

type Direction = "expand" | "shrink";

/**
 * アイデアを出すゲーム
 */
export class IdeaLiveGame extends LiveGame {
	override unlockThreshold = 0;
	private speech: g.Label;
	private idea: g.Sprite;
	// デザインのため2箇所に同じものを表示
	private ideaClone: g.Sprite;
	private static speechFont = new g.DynamicFont({ game: g.game, fontFamily: "sans-serif", size: 40 });

	protected override handleIntroduction({ container, scene }: LiveContext, next: () => void): (() => void) | void {
		container.append(new g.FilledRect({
			scene,
			width: container.width,
			height: container.height,
			cssColor: "khaki",
			opacity: 0.5
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
			font: IdeaLiveGame.speechFont,
			text: "どんなゲームにしようかな"
		});

		(async () => {
			await sleep(TEXT_VIEW_TIME);
			next();
		})();
	}
	protected override handleGamePlay({ container, scene, broadcaster, vars }: LiveContext): (() => void) | void {
		const ideaOption: g.SpriteParameterObject = {
			scene,
			parent: container,
			src: scene.asset.getImageById("idea"),
			y: container.height / 2,
			anchorX: 0.5,
			anchorY: 0.5,
			scaleX: g.game.random.generate(),
			scaleY: g.game.random.generate(),
			opacity: g.game.random.generate(),
		};
		this.idea = new g.Sprite({
			...ideaOption,
			x: container.width * 1 / 5,
		});
		this.ideaClone = new g.Sprite({
			...ideaOption,
			x: container.width * 4 / 5,
		});
		let sizeDirection: {
			x: Direction; y: Direction;
		} = { x: "expand", y: "expand" };
		let opacityDirection: Direction = "expand";
		const updateHandler = (): void => {
			// やる気・アイデアの値が高いほど、速度アップで難しくなる
			const multiply = Math.max(1, (vars as ContextVars).motivation) + Math.max(1, (vars as ContextVars).idea);
			this.idea.scaleX += 0.02 * multiply * (sizeDirection.x === "expand" ? 1 : -1);
			this.idea.scaleY += 0.015 * multiply * (sizeDirection.y === "expand" ? 1 : -1);
			this.idea.opacity += 0.01 * multiply * (opacityDirection === "expand" ? 1 : -1);
			if (this.idea.scaleX > 1) {
				this.idea.scaleX = 1;
				sizeDirection.x = "shrink";
			}
			if (this.idea.scaleY > 1) {
				this.idea.scaleY = 1;
				sizeDirection.y = "shrink";
			}
			if (this.idea.scaleX < 0.25) {
				this.idea.scaleX = 0.25;
				sizeDirection.x = "expand";
			}
			if (this.idea.scaleY < 0.25) {
				this.idea.scaleY = 0.25;
				sizeDirection.y = "expand";
			}
			if (this.idea.opacity > 1) {
				this.idea.opacity = 1;
				opacityDirection = "shrink";
			}
			if (this.idea.opacity < 0.25) {
				this.idea.opacity = 0.25;
				opacityDirection = "expand";
			}
			this.idea.modified();
			this.ideaClone.scaleX = this.idea.scaleX;
			this.ideaClone.scaleY = this.idea.scaleY;
			this.ideaClone.opacity = this.idea.opacity;
			this.ideaClone.modified();
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
			this.speech.hide();
			button.hide();
			play("se_nc227995.mp3");
			next();
		});
		return () => {
			button.destroy();
		};
	}

	protected override evaluateScore(context: LiveContext): number {
		return this.idea.scaleX * this.idea.scaleY * this.idea.opacity * 100;
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
		vars.onLiveGameResult.fire({ gameType: "idea", score });
		vars.idea = Math.min(vars.idea + score / 100, MAX_IDEA);
		return super.handleResultViewing(context, score, next);
	}
}
