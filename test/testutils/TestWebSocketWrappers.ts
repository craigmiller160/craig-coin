import {
	WebSocketHttpsServerWrapper,
	WebSocketServerWrapper,
	WebSocketWrapper
} from '../../src/p2p/WebSocketWrappers';
import WebSocket from 'ws';

export class TestWebSocketWrapper implements WebSocketWrapper {
	#readyState: number = WebSocket.OPEN;
	events: { [name: string]: [(message?: string) => void] } = {};
	sentData: string[] = [];

	get readyState(): number {
		return this.#readyState;
	}

	updateReadyState(readyState: number) {
		this.#readyState = readyState;
	}

	constructor(public address: string) {}

	on(event: string, fn: (message?: string) => void): void {
		const existing = this.events[event] ?? [];
		existing.push(fn);
		this.events[event] = existing;
	}

	send(data: string): void {
		this.sentData.push(data);
	}
}

export class TestWebSocketHttpsServerWrapper
	implements WebSocketHttpsServerWrapper
{
	listenPort = 0;
	listen(port: number): void {
		this.listenPort = port;
	}
}

export class TestWebSocketServerWrapper implements WebSocketServerWrapper {
	events: { [name: string]: [(socket: WebSocketWrapper) => void] } = {};
	on(event: string, fn: (socket: WebSocketWrapper) => void): void {
		const existing = this.events[event] ?? [];
		existing.push(fn);
		this.events[event] = existing;
	}
}
