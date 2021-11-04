import request from 'supertest';
import { Blockchain } from '../../src/chain/Blockchain';
import { createServer } from '../../src/server';

describe('mine', () => {
	it('creates a new block on the blockchain', async () => {
		const body = {
			data: []
		};
		const blockchain = new Blockchain();
		const app = createServer(blockchain);
		await request(app).post('/mine').send(body).expect(302);
		expect(blockchain.chain).toHaveLength(2);
		expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
			body.data
		);
	});
});
