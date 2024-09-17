import * as path from "path";
import { GameContext, RunnerV3_g as g } from "@akashic/headless-akashic";

describe("mainScene", () => {
	it("ゲームが正常に動作できる", async () => {
		const context = new GameContext<3>({
			gameJsonPath: path.join(__dirname, "..", "game.json")
		});
		const client = await context.getGameClient();
		expect(client.type).toBe("active");

		const game = client.game!;
		expect(game.width).toBe(1280);
		expect(game.height).toBe(720);
		expect(game.fps).toBe(30);

		await client.advanceUntil(
			() => game.scene()!.local !== "full-local" && game.scene()!.name !== "_bootstrap"
		); // ローカル(ローディング)シーンを抜けるまで進める

		const scene = client.game.scene()!;
		expect(scene).toBeDefined();

		// 初期スコア、時間の値を確認
		await context.step();
		const scoreLabel = scene.children[3].children[0] as g.Label;
		expect(scoreLabel.text).toBe("スコア   0点");

		const timeLabel = scene.children[3].children[1] as g.Label;
		expect(timeLabel.text).toBe("残り59秒");

		// 制限時間がなくなった時の時間表示を確認
		await context.advance(60000);
		expect(timeLabel.text).toBe("残り 0秒");

		await context.destroy();
	});
});
