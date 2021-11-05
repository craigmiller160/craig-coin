import request from 'supertest';
import { createServer } from '../../src/rest-server';
import { Blockchain } from '../../src/chain/Blockchain';
import { P2pServer } from '../../src/p2p-server';

jest.mock('../../src/p2p-server');

describe('getBlocks', () => {
	it('returns blocks from blockchain', async () => {
		const blockchain = new Blockchain();
		const p2pServer = new P2pServer(blockchain);
		const app = createServer(blockchain, p2pServer);
		const response = await request(app)
			.get('/blocks')
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(response.body).toEqual(blockchain.chain);
	});
});
