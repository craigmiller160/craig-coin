import WebSocket, { Server } from 'ws';
import { Blockchain } from './chain/Blockchain';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

export class P2pServer {
	#sockets: ReadonlyArray<WebSocket> = [];
	constructor(public readonly blockchain: Blockchain) {}

	listen() {
		const server = new Server({
			port: P2P_PORT
		});
		server.on('connection', (socket) => this.#connectSocket(socket));
		console.info(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
	}

	#connectSocket(socket: WebSocket) {
		this.#sockets = [...this.#sockets, socket];
		console.debug('Socket Connected');
	}
}
