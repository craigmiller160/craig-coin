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
import https, { ServerOptions } from 'https';
import fs from 'fs';
import path from 'path';
import nocache from 'nocache';

const HTTP_PORT = process.env.HTTP_PORT
	? parseInt(process.env.HTTP_PORT)
	: 3001;

const ciphers = [
	'ECDHE-ECDSA-AES256-GCM-SHA384',
	'ECDHE-RSA-AES256-GCM-SHA384',
	'ECDHE-ECDSA-CHACHA20-POLY1305',
	'ECDHE-RSA-CHACHA20-POLY1305',
	'ECDHE-ECDSA-AES128-GCM-SHA256',
	'ECDHE-RSA-AES128-GCM-SHA256',
	'ECDHE-ECDSA-AES256-SHA384',
	'ECDHE-RSA-AES256-SHA384',
	'ECDHE-ECDSA-AES128-SHA256',
	'ECDHE-RSA-AES128-SHA256'
];

const tlsProps: ServerOptions = {
	key: fs.readFileSync(
		path.resolve(__dirname, '..', 'certs', 'craigcoin.key.pem')
	),
	cert: fs.readFileSync(
		path.resolve(__dirname, '..', 'certs', 'craigcoin.cert.pem')
	),
	ciphers: ciphers.join(';')
};

export const createServerApplication = (
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	wallet: Wallet,
	p2pServer: P2pServer
): Express => {
	const app = express();
	app.disable('x-powered-by');
	app.use(bodyParser.json());
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
	app.use(nocache());
	app.disable('x-powered-by');
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
	const server = https.createServer(tlsProps, app);
	server.listen(HTTP_PORT, () => {
		logger.info(`Listening on port ${HTTP_PORT}`);
	});
};
