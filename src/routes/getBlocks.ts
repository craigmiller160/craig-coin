import type { Blockchain } from '../chain/Blockchain';
import { Express } from 'express';

const foo = 'bar';

export const configureGetBlocks = (app: Express, blockchain: Blockchain) =>
	app.get('/blocks', (req, res) => {
		res.json(blockchain.chain);
	});
