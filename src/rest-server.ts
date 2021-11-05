import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { configureGetBlocks } from './routes/getBlocks';
import { configureMine } from './routes/mine';
import { Blockchain } from './chain/Blockchain';
import { P2pServer } from './p2p-server';
import {logger} from './logger';

logger.info('Testing 123')

const HTTP_PORT = process.env.HTTP_PORT
	? parseInt(process.env.HTTP_PORT)
	: 3001;

export const createServer = (
	blockchain: Blockchain,
	p2pServer: P2pServer
): Express => {
	const app = express();
	app.disable('x-powered-by');
	app.use(bodyParser.json());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain, p2pServer);
	return app;
};

export const createAndStartRestServer = (
	blockchain: Blockchain,
	p2pServer: P2pServer
) => {
	const app = createServer(blockchain, p2pServer);
	app.listen(HTTP_PORT, () => {
		console.info(`Listening on port ${HTTP_PORT}`);
	});
};
