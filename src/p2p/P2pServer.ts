import WebSocket, { Server as WsServer } from 'ws';
import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import { Server as HttpsServer } from 'https';
import { createHttpsServer } from '../tls';
import { logger } from '../logger';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5001;

export class P2pServer {
	#sockets: ReadonlyArray<WebSocket> = [];
	readonly #webSocketServer: WsServer;
	readonly #httpsServer: HttpsServer;
	constructor(
		// TODO see if these dependencies can be eliminated
		public readonly blockchain: Blockchain,
		public readonly transactionPool: TransactionPool
	) {
		this.#httpsServer = createHttpsServer();
		this.#webSocketServer = new WsServer({
			server: this.#httpsServer
		});
		// TODO need to configure the on() callback
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
