import { createAndStartRestServer } from './rest-server';
import { Wallet } from './wallet/Wallet';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { logger } from './logger';
import { setupBlockchainAndTransactionPool } from './setup/setupBlockchainAndTransactionPool';
import { setupP2pServer } from './setup/setupP2pServer';

pipe(
	setupBlockchainAndTransactionPool(),
	E.chain(([blockchain, transactionPool]) =>
		setupP2pServer(blockchain, transactionPool)
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
