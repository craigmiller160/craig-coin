import express, { Express } from 'express';
import { configureGetBlocks } from '../../src/routes/getBlocks';
import { Blockchain } from '../../src/chain/Blockchain';
import { configureMine } from '../../src/routes/mine';
import bodyParser from 'body-parser';

export const createTestServer = (): [Express, Blockchain] => {
	const blockchain = new Blockchain();
	const app = express();
	app.use(bodyParser.json());
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain);

	return [app, blockchain];
};
