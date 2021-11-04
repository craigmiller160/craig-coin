import express, { Express } from 'express';
import { configureGetBlocks } from '../../src/routes/getBlocks';
import { Blockchain } from '../../src/chain/Blockchain';
import {configureMine} from '../../src/routes/mine';

export const createTestServer = (): [Express, Blockchain] => {
	const blockchain = new Blockchain();
	const app = express();
	configureGetBlocks(app, blockchain);
	configureMine(app, blockchain);

	return [app, blockchain];
};
