import request from 'supertest';
import { Blockchain } from '../../src/chain/Blockchain';
import { createServer } from '../../src/rest-server';
import { P2pServer } from '../../src/p2p-server';

jest.mock('../../src/p2p-server');

describe('mine', () => {
	it('creates a new block on the blockchain', async () => {
		const body = {
			data: []
		};
		const blockchain = new Blockchain();
		const p2pServer = new P2pServer(blockchain);
		const app = createServer(blockchain, p2pServer);
		await request(app).post('/mine').send(body).expect(302);
		expect(blockchain.chain).toHaveLength(2);
		expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
			body.data
		);
		expect(p2pServer.syncChains).toHaveBeenCalled();
	});
});
