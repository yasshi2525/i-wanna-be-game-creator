/**
 * ミニゲームで使う定数の定義
 */
export const constants = {
	/**
	 * 残り体力について
	 */
	lifeGauge: {
		x: 100,
		y: -70,
		width: 400,
		height: 50,
		color: "mediumseagreen",
		/**
		 * 初期体力
		 */
		life: 8,
		/**
		 * 障壁 (Obstacle) が一回爆発(expire)した際、減る体力
		 */
		damage: 1,
		/**
		 * ゲーム終了時、この体力の分に乗じた値分、ボーナスが発生します.
		 */
		bonus: 1,
	},
	/**
	 * 完成度について
	 */
	progressor: {
		x: 520,
		y: -70,
		width: 400,
		height: 50,
		color: "royalblue",
		/**
		 * 弾 (Attacker) 1発分につき増える進捗 (1で完成)
		 */
		magnitude: 0.015
	},
	/**
	 * 障壁について
	 */
	obstacle: {
		/**
		 * 何発の Attacker が当たれば破壊できるか.
		 * 生成回数依存（最初は弱く、だんだん強く）
		 */
		life: { min: 2, max: 4 },
		/**
		 * 何ミリ秒立っても破壊されなかった場合に爆発（expire、ペナルティ）するか
		 */
		span: 8000,
		/**
		 * 表示色
		 */
		color: "maroon",
		tipColor: "rosybrown",
		width: 200,
		height: 100,
		font: new g.DynamicFont({
			game: g.game,
			size: 40,
			fontFamily: "sans-serif",
			fontWeight: "bold",
			fontColor: "white",
			strokeColor: "black",
			strokeWidth: 4
		}),
		successFont: new g.DynamicFont({
			game: g.game,
			size: 40,
			fontFamily: "sans-serif",
			fontWeight: "bold",
			fontColor: "mediumseagreen",
			strokeColor: "white",
			strokeWidth: 4
		}),
		failedFont: new g.DynamicFont({
			game: g.game,
			size: 40,
			fontFamily: "sans-serif",
			fontWeight: "bold",
			fontColor: "firebrick",
			strokeColor: "white",
			strokeWidth: 4
		}),
	},
	/**
	 * 障壁の生成について
	 */
	spawner: {
		/**
		 * 生成間隔
		 *
		 * idea 依存
		 */
		interval: { min: 2000, max: 12000 }
	},
	/**
	 * 自機回転機について
	 */
	rotator: {
		x: 0,
		y: 200,
	},
	/**
	 * 弾 (Attacker) の射出機について
	 */
	shooter: {
		src: g.game.scene().asset.getImageById("shooter_img"),
		x: 0,
		y: 200,
		anchorX: 0.5,
		anchorY: 0.5,
		/**
		 * 弾 (Attacker) の射出間隔 (ミリ秒)
		 *
		 * motivation 依存
		 */
		interval: { min: 200, max: 500 },
	},
	/**
	 * 弾について
	 */
	attacker: {
		src: g.game.scene().asset.getImageById("attacker_img"),
		scaleX: 0.5,
		scaleY: 0.5,
		/**
		 * 1秒あたり進む距離
		 */
		speed: 400,
	},
	/**
	 * タスク（壊すと完成度が高まる）
	 */
	task: {
		color: "royalblue",
		tipColor: "lightblue",
		width: 60,
		height: 20
	}
};
