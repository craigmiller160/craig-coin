import { Blockchain } from '../chain/Blockchain';
import { TransactionPool } from '../transaction/TransactionPool';
import { P2pServer } from '../p2p/P2pServer';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { connectToPeers, createP2pServer } from '../p2p/p2pUtils';

export type ChainPoolAndServer = [Blockchain, TransactionPool, P2pServer];

export const setupP2pServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool
): E.Either<Error, ChainPoolAndServer> =>
	pipe(
		createP2pServer(blockchain, transactionPool),
		E.chain((p2pServer) =>
			pipe(
				p2pServer.listen(),
				E.map(() => p2pServer)
			)
		),
		E.map((p2pServer) => {
			connectToPeers(p2pServer, blockchain, transactionPool);
			return p2pServer;
		}),
		E.map(
			(p2pServer): ChainPoolAndServer => [
				blockchain,
				transactionPool,
				p2pServer
			]
		)
	);
