export class MockWebSocket {}

type ConnectionFn = (socket: MockWebSocket) => void;

export const onConnectionFns: ConnectionFn[] = [];

export const clearOnConnectionFns = () => {
	while (onConnectionFns.length) {
		onConnectionFns.pop();
	}
};

export class MockWebSocketServer {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(public httpsServer: any) {}

	on(event: string, fn: ConnectionFn) {
		if (event !== 'connection') {
			throw new Error('Invalid event name');
		}
		onConnectionFns.push(fn);
	}
}
