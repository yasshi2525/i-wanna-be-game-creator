import { Attacker } from "./attacker";
import { Obstacle } from "./obstacle";

/**
 * 弾 (Attacker) が 障壁 (Obstascle) にあたったら爆発 (break) させる
 */
export class Blaster {
	readonly onDeleteAttacker = new g.Trigger<Attacker>();
	private readonly obstacles: Set<Obstacle> = new Set();
	private readonly attackers: Set<Attacker> = new Set();

	constructor({ scene, container }: BlasterOption) {
		container.onUpdate.add(() => {
			const attackers = [...this.attackers].filter(a => !a.destroyed());
			for (const attacker of attackers) {
				const obstacles = [...this.obstacles].filter(o => !o.destroyed());
				for (const obstacle of obstacles) {
					const area = obstacle.calculateBoundingRect();
					if (attacker.x >= area.left && attacker.x <= area.right && attacker.y >= area.top && attacker.y <= area.bottom) {
						obstacle.attack();
						attacker.destroy();
						this.attackers.delete(attacker);
						this.onDeleteAttacker.fire(attacker);
					}
				}
			}
		});
	}

	addObstacle(o: Obstacle): void {
		this.obstacles.add(o);
	}

	addAttacker(a: Attacker): void {
		this.attackers.add(a);
	}
}

interface BlasterOption {
	scene: g.Scene;
	container: g.E;
}
