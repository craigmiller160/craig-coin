import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { configureGetBlocks } from './routes/blocks';
import { configureMine } from './routes/mine';
import { Blockchain } from './chain/Blockchain';
import { P2pServer } from './p2p-server';
import { logger } from './logger';
import { TransactionPool } from './transaction/TransactionPool';
import {
	configureCreateTransaction,
	configureGetTransactions
} from './routes/transactions';
import { Wallet } from './wallet/Wallet';
import { configureGetWallet } from './routes/wallet';

const HTTP_PORT = process.env.HTTP_PORT
	? parseInt(process.env.HTTP_PORT)
	: 3001;

export const createServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
): Express => {
	const app = express();
	app.disable('x-powered-by');
	app.use(bodyParser.json());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain, p2pServer);
	configureGetTransactions(app, transactionPool);
	configureCreateTransaction(app, wallet, transactionPool);
	configureGetWallet(app, wallet);
	return app;
};

export const createAndStartRestServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
) => {
	const app = createServer(blockchain, transactionPool, wallet, p2pServer);
	app.listen(HTTP_PORT, () => {
		logger.info(`Listening on port ${HTTP_PORT}`);
	});
};
