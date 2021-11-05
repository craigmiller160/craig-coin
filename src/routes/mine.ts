import { Blockchain } from '../chain/Blockchain';
import { Express, Request } from 'express';
import { MineRequest } from '../types/blockTypes';
import { P2pServer } from '../p2p-server';
import { logger } from '../logger';

export const configureMine = (
	app: Express,
	blockchain: Blockchain,
	p2pServer: P2pServer
) =>
	app.post('/mine', (req: Request<unknown, unknown, MineRequest>, res) => {
		const block = blockchain.addBlock(req.body.data);
		logger.info(`New block added: ${block}`);
		p2pServer.syncChains();
		res.redirect('/blocks');
	});
