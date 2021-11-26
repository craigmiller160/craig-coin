import { Blockchain } from './chain/Blockchain';
import { createAndStartRestServer } from './rest-server';
import { TransactionPool } from './transaction/TransactionPool';
import { Wallet } from './wallet/Wallet';
import { pipe } from 'fp-ts/function';
import { genesisBlock } from './block/blockUtils';
import * as E from 'fp-ts/Either';
import { logger } from './logger';
import { connectToPeers, createP2pServer } from './p2p/p2pUtils';
import { P2pServer } from './p2p/P2pServer';

type ChainAndPool = [Blockchain, TransactionPool];
type ChainPoolAndServer = [Blockchain, TransactionPool, P2pServer];

const setupBlockchainAndTransactionPool = (): E.Either<Error, ChainAndPool> =>
	pipe(
		genesisBlock(),
		E.map((genesisBlock): ChainAndPool => {
			const blockchain = new Blockchain(genesisBlock);
			const transactionPool = new TransactionPool();
			return [blockchain, transactionPool];
		})
	);

pipe(
	setupBlockchainAndTransactionPool(),
	E.chain(([blockchain, transactionPool]) =>
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
		)
	),
	E.fold(
		(error) => {
			logger.error('Error starting Blockchain application');
			logger.error(error);
			process.exit(1);
		},
		([blockchain, transactionPool, p2pServer]) => {
			const wallet = new Wallet();
			createAndStartRestServer(
				blockchain,
				transactionPool,
				wallet,
				p2pServer
			);
			logger.info('Started Blockchain application');
		}
	)
);
