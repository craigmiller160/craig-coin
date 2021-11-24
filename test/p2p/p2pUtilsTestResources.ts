export class MockWebSocket {}

type ConnectionFn = (socket: MockWebSocket) => void;

export class MockWebSocketServer {
	connections: ConnectionFn[] = [];
	constructor(public httpsServer: any) {}

	on(event: string, fn: ConnectionFn) {
		if (event !== 'connection') {
			throw new Error('Invalid event name');
		}
		this.connections.push(fn);
	}
}
