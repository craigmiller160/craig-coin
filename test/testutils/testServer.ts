import express, { Express } from 'express';
import { configureGetBlocks } from '../../src/routes/getBlocks';
import { Blockchain } from '../../src/chain/Blockchain';

export const createTestServer = (): [Express, Blockchain] => {
	const blockchain = new Blockchain();
	const app = express();
	configureGetBlocks(app, blockchain);
	return [app, blockchain];
};
