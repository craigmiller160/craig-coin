import { logger } from '../logger';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';
import {
	WebSocketHttpsServerWrapper,
	WebSocketServerWrapper,
	WebSocketWrapper
} from './WebSocketWrappers';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;

export class P2pServer {
	#connectedSockets: ReadonlyArray<WebSocketWrapper> = [];

	constructor(
		public readonly webSocketServer: WebSocketServerWrapper,
		public readonly httpsServer: WebSocketHttpsServerWrapper
	) {}

	get connectedSockets(): ReadonlyArray<WebSocketWrapper> {
		return this.#connectedSockets.slice();
	}

	// TODO add test
	updateSockets(sockets: ReadonlyArray<WebSocketWrapper>) {
		if (sockets.length !== this.#connectedSockets.length) {
			this.#connectedSockets = sockets;
			logger.debug(
				`Updating sockets to remove closed connections. Total sockets: ${
					this.#connectedSockets.length
				}`
			);
		}
	}

	addConnectedSocket(socket: WebSocketWrapper) {
		this.#connectedSockets = [...this.#connectedSockets, socket];
		logger.debug(
			`New socket connected. Total sockets: ${
				this.#connectedSockets.length
			}`
		);
	}

	listen(): E.Either<Error, void> {
		return E.tryCatch(() => {
			logger.info(
				`Listening for peer-to-peer connections on: ${P2P_PORT}`
			);
			this.httpsServer.listen(P2P_PORT);
		}, unknownToError);
	}
}
