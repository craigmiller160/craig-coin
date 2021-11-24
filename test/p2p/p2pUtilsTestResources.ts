export class MockWebSocket {
	on(event: string, fn: SocketFn) {
		if (event !== 'message') {
			throw new Error('Invalid event type');
		}
		onMessageFns.push(fn);
	}

	send(message: string) {
		messagesSent.push(message);
	}
}

type SocketFn = (socket: MockWebSocket) => void;

export const messagesSent: string[] = [];

export const onMessageFns: SocketFn[] = [];

export const onConnectionFns: SocketFn[] = [];

export const clearFnArrays = () => {
	while (onConnectionFns.length) {
		onConnectionFns.pop();
	}

	while (onMessageFns.length) {
		onMessageFns.pop();
	}

	while (messagesSent.length) {
		messagesSent.pop();
	}
};

export class MockWebSocketServer {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(public httpsServer: any) {}

	on(event: string, fn: SocketFn) {
		if (event !== 'connection') {
			throw new Error('Invalid event name');
		}
		onConnectionFns.push(fn);
	}
}
