import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { configureGetBlocks } from './routes/getBlocks';
import { configureMine } from './routes/mine';
import { Blockchain } from './chain/Blockchain';

const HTTP_PORT = process.env.HTTP_PORT
	? parseInt(process.env.HTTP_PORT)
	: 3001;

export const createServer = (blockchain: Blockchain): Express => {
	const app = express();
	app.use(bodyParser.json());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain);
	return app;
};

export const createAndStartRestServer = (blockchain: Blockchain) => {
	const app = createServer(blockchain);
	app.listen(HTTP_PORT, () => {
		console.info(`Listening on port ${HTTP_PORT}`);
	});
};
