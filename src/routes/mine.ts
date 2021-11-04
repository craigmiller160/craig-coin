import { Blockchain } from '../chain/Blockchain';
import { Express, Request } from 'express';
import { MineRequest } from '../types/blockTypes';

export const configureMine = (app: Express, blockchain: Blockchain) =>
	app.post('/mine', (req: Request<{}, {}, MineRequest>, res) => {
		const block = blockchain.addBlock(req.body.data);
		console.info(`New block added: ${block}`);
		res.redirect('/blocks');
	});
