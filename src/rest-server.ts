import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { configureGetBlocks } from './routes/getBlocks';
import { configureMine } from './routes/mine';
import { Blockchain } from './chain/Blockchain';
import { P2pServer } from './p2p-server';
import { logger } from './logger';
import { TransactionPool } from './transaction/TransactionPool';
import { configureGetTransactions } from './routes/getTransactions';

const HTTP_PORT = process.env.HTTP_PORT
	? parseInt(process.env.HTTP_PORT)
	: 3001;

export const createServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	p2pServer: P2pServer
): Express => {
	const app = express();
	app.disable('x-powered-by');
	app.use(bodyParser.json());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain, p2pServer);
	configureGetTransactions(app, transactionPool);
	return app;
};

export const createAndStartRestServer = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	p2pServer: P2pServer
) => {
	const app = createServer(blockchain, transactionPool, p2pServer);
	app.listen(HTTP_PORT, () => {
		logger.info(`Listening on port ${HTTP_PORT}`);
	});
};
