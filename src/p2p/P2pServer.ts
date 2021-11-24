import WebSocket, { Server as WsServer } from 'ws';
import { Server as HttpsServer } from 'https';
import { logger } from '../logger';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;

export class P2pServer {
	#connectedSockets: ReadonlyArray<WebSocket> = [];
	readonly #webSocketServer: WsServer;
	readonly #httpsServer: HttpsServer;

	constructor(webSocketServer: WsServer, httpsServer: HttpsServer) {
		this.#webSocketServer = webSocketServer;
		this.#httpsServer = httpsServer;
	}

	addConnectedSocket(socket: WebSocket) {
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
