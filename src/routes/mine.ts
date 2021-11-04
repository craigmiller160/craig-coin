import { Blockchain } from '../chain/Blockchain';
import { Express } from 'express';
import { BlockData } from '../types/blockTypes';

export const configureMine = (app: Express, blockchain: Blockchain) =>
	app.post('/mine', (req, res) => {
		// TODO figure out how to parameterize this better
		const block = blockchain.addBlock(req.body.data as BlockData);
		console.info(`New block added: ${block}`);
		res.redirect('/blocks');
	});
