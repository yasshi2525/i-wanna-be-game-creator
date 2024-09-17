export const wait = async <T>(trigger: g.Trigger<T>): Promise<T> =>
	new Promise<T>(resolve => {
		trigger.addOnce(resolve);
	});


export const sleep = async (millsec: number): Promise<void> =>
	new Promise<void>(resolve => {
		g.game.scene()!.setTimeout(resolve, millsec);
	});

