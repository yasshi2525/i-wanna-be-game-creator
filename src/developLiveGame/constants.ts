/**
 * ミニゲームで使う定数の定義
 */
export const constants = {
	/**
	 * 残り体力について
	 */
	lifeGauge: {
		x: 680,
		y: 0,
		width: 400,
		height: 50,
		color: "mediumseagreen",
		/**
		 * 初期体力
		 */
		life: 10,
		/**
		 * 障壁 (Obstacle) が一回爆発(expire)した際、減る体力
		 */
		damage: 1,
	},
	/**
	 * 完成度について
	 */
	progressor: {
		x: 680,
		y: 50,
		width: 400,
		height: 50,
		color: "royalblue",
		/**
		 * 弾 (Attacker) 1発分につき増える進捗 (1で完成)
		 */
		magnitude: 0.02
	},
	/**
	 * 障壁について
	 */
	obstacle: {
		/**
		 * 何発の Attacker が当たれば破壊できるか.
		 * 生成回数依存（最初は弱く、だんだん強く）
		 */
		life: { min: 5, max: 20 },
		/**
		 * 何ミリ秒立っても破壊されなかった場合に爆発（expire、ペナルティ）するか
		 */
		span: 6000,
		/**
		 * 表示色
		 */
		color: "maroon",
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
		})
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
		interval: { min: 2000, max: 6000 }
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
		interval: { min: 100, max: 500 },
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
	}
};
