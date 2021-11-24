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
	readonly #webSocketServer: WebSocketServerWrapper;
	readonly #httpsServer: WebSocketHttpsServerWrapper;

	constructor(
		webSocketServer: WebSocketServerWrapper,
		httpsServer: WebSocketHttpsServerWrapper
	) {
		this.#webSocketServer = webSocketServer;
		this.#httpsServer = httpsServer;
	}

	get connectedSockets(): ReadonlyArray<WebSocketWrapper> {
		return this.#connectedSockets;
	}

	addConnectedSocket(socket: WebSocketWrapper) {
		this.#connectedSockets = [...this.#connectedSockets, socket];
	}

	listen(): E.Either<Error, void> {
		return E.tryCatch(() => {
			logger.info(
				`Listening for peer-to-peer connections on: ${P2P_PORT}`
			);
			this.#httpsServer.listen(P2P_PORT);
		}, unknownToError);
	}
}
