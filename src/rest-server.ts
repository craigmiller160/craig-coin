import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { configureGetBlocks } from './routes/blocks';
import { configureMine } from './routes/mine';
import { Blockchain } from './chain/Blockchain';
import { logger } from './logger';
import { TransactionPool } from './transaction/TransactionPool';
import {
	configureCreateTransaction,
	configureGetTransactions
} from './routes/transactions';
import { Wallet } from './wallet/Wallet';
import { configureGetWallet } from './routes/wallet';
import nocache from 'nocache';
import basicAuth from 'express-basic-auth';
import { createHttpsServer } from './tls';
import { P2pServer } from './p2p/P2pServer';

const HTTP_PORT = process.env.HTTP_PORT
	? parseInt(process.env.HTTP_PORT)
	: 3001;

const basicAuthUser = process.env.BASIC_AUTH_USER;
if (!basicAuthUser) {
	throw new Error('Cannot run application without BASIC_AUTH_USER');
}

const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;
if (!basicAuthPassword) {
	throw new Error('Cannot run application without BASIC_AUTH_PASSWORD');
}

export const createServerApplication = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
): Express => {
	const app = express();
	app.disable('x-powered-by');
	app.use(
		basicAuth({
			users: {
				[basicAuthUser]: basicAuthPassword
			}
		})
	);
	app.use(bodyParser.json());
	app.use(nocache());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain, transactionPool, wallet, p2pServer);
	configureGetTransactions(app, transactionPool);
	configureCreateTransaction(
		app,
		wallet,
		p2pServer,
		blockchain,
		transactionPool
	);
	configureGetWallet(app, wallet);
	return app;
};

export const createAndStartRestServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
) => {
	const app = createServerApplication(
		blockchain,
		transactionPool,
		wallet,
		p2pServer
	);
	const server = createHttpsServer(app);
	server.listen(HTTP_PORT, () => {
		logger.info(`Listening on port ${HTTP_PORT}`);
	});
};
