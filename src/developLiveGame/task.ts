import { playForcibly } from "../utils";
import { Attacker } from "./attacker";
import { constants } from "./constants";

/**
 * これを壊すと完成度が高まる
 */
export class Task extends g.E {
	/**
	 * Attacker によって破壊されたとき発火します
	 */
	readonly onBreak = new g.Trigger();
	private readonly bounds: g.CommonRect;

	/**
	 * 全Taskの座標をつくります
	 */
	static init(container: g.CommonArea): Set<g.CommonArea> {
		const tasks = new Set<g.CommonArea>();
		for (let x = 240; x <= container.width - constants.task.width; x += constants.task.width) {
			for (const y of [
				0,
				constants.task.height,
				container.height - constants.task.height * 2,
				container.height - constants.task.height
			]) {
				tasks.add({
					x,
					y,
					width: constants.task.width,
					height: constants.task.height,
				});
			}
		}
		for (let x = 270; x <= container.width - constants.task.height * 3; x += 150) {
			for (let y = constants.task.width * 2;
				y < container.height - constants.task.height * 2 - constants.task.width;
				y += constants.task.width) {
				for (let dx = 0; dx < 3 * constants.task.height; dx += constants.task.height) {
					tasks.add({
						x: x + dx,
						y,
						width: constants.task.height,
						height: constants.task.width,
					});
				}
			}
		}
		return tasks;
	}

	/**
	 * 座標から、画面上に残りのTaskを配置させます
	 */
	static deploy(container: g.E, tasks: Set<g.CommonArea>): Set<Task> {
		const taskEntities = new Set<Task>();
		for (const t of [...tasks]) {
			taskEntities.add(new Task({
				scene: container.scene,
				parent: container,
				color: constants.task.color,
				...t,
			}));
		}
		return taskEntities;
	}

	constructor(opts: TaskOptions) {
		super(opts);
		this.append(new g.FilledRect({
			scene: this.scene,
			x: 1,
			y: 1,
			width: this.width - 2,
			height: this.height - 2,
			cssColor: opts.color,
		}));
		this.bounds = {
			left: this.x,
			right: this.x + this.width,
			top: this.y,
			bottom: this.y + this.height,
		};
	}

	watch(attacker: Attacker): void {
		this.onUpdate.add(() => {
			if (attacker.destroyed()) {
				return true;
			}
			if (this.bounds.left <= attacker.x && attacker.x <= this.bounds.right
				&& this.bounds.top <= attacker.y && attacker.y <= this.bounds.bottom
			) {
				// Task を消化したときのエフェクト
				const tip = new g.FilledRect({
					scene: this.scene,
					x: this.x + this.width / 2,
					y: this.y + this.height / 2,
					width: this.width,
					height: this.height,
					anchorX: 0.5,
					anchorY: 0.5,
					cssColor: constants.task.tipColor,
				});
				tip.onUpdate.add(() => {
					tip.width -= this.width * 0.1;
					tip.height -= this.width * 0.1;
					if (tip.width < 0 || tip.height < 0) {
						tip.destroy();
						return true;
					}
					tip.modified();
				});
				this.parent.insertBefore(tip, this);
				playForcibly("se_nc1281.wav");
				this.onBreak.fire();
				attacker.destroy();
				this.destroy();
				return true;
			}
		});
	}
}

export interface TaskOptions extends g.EParameterObject {
	color: string;
}
