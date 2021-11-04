import request from 'supertest';
import { createServer } from '../../src/rest-server';
import { Blockchain } from '../../src/chain/Blockchain';

describe('getBlocks', () => {
	it('returns blocks from blockchain', async () => {
		const blockchain = new Blockchain();
		const app = createServer(blockchain);
		const response = await request(app)
			.get('/blocks')
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(response.body).toEqual(blockchain.chain);
	});
});
