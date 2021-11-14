import { Blockchain } from './chain/Blockchain';
import { createAndStartRestServer } from './rest-server';
import { P2pServer } from './p2p-server';
import { TransactionPool } from './transaction/TransactionPool';
import { Wallet } from './wallet/Wallet';
import { pipe } from 'fp-ts/function';
import { genesisBlock } from './block/blockUtils';
import * as E from 'fp-ts/Either';
import { logger } from './logger';

pipe(
	genesisBlock(),
	E.map((genesisBlock) => new Blockchain(genesisBlock)),
	E.fold(
		(error) => {
			logger.error('Error starting Blockchain application');
			logger.error(error);
		},
		(blockchain) => {
			const wallet = new Wallet();
			const transactionPool = new TransactionPool();
			const p2pServer = new P2pServer(blockchain, transactionPool);
			p2pServer.listen();
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
