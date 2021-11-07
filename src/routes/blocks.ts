import { Blockchain } from '../chain/Blockchain';
import { Express } from 'express';

export const configureGetBlocks = (app: Express, blockchain: Blockchain) =>
	app.get('/blocks', (req, res) => {
		res.json(blockchain.chain);
	});
