import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { configureGetBlocks } from './routes/getBlocks';
import { configureMine } from './routes/mine';
import { Blockchain } from './chain/Blockchain';

export const createServer = (blockchain: Blockchain): Express => {
	const app = express();
	app.use(bodyParser.json());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain);
	return app;
};
