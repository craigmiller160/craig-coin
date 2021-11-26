import { createAndStartRestServer } from './rest-server';
import { Wallet } from './wallet/Wallet';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { logger } from './logger';
import { setupBlockchainAndTransactionPool } from './setup/setupBlockchainAndTransactionPool';
import { setupP2pServer } from './setup/setupP2pServer';
import { Blockchain } from './chain/Blockchain';
import { TransactionPool } from './transaction/TransactionPool';
import { P2pServer } from './p2p/P2pServer';
import { setupWallet } from './setup/setupWallet';

type BlockchainPoolP2pWallet = [Blockchain, TransactionPool, P2pServer, Wallet];

pipe(
	setupBlockchainAndTransactionPool(),
	E.chain(([blockchain, transactionPool]) =>
		setupP2pServer(blockchain, transactionPool)
	),
	E.chain(([blockchain, transactionPool, p2pServer]) =>
		pipe(
			setupWallet(),
			E.map(
				(wallet): BlockchainPoolP2pWallet => [
					blockchain,
					transactionPool,
					p2pServer,
					wallet
				]
			)
		)
	),
	E.fold(
		(error) => {
			logger.error('Error starting Blockchain application');
			logger.error(error);
			setTimeout(() => {
				process.exit(1);
			}, 1000);
		},
		([blockchain, transactionPool, p2pServer, wallet]) => {
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
