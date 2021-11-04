import { createTestServer } from '../testutils/testServer';
import request from 'supertest';

describe('mine', () => {
	it('creates a new block on the blockchain', async () => {
		const body = {
			data: []
		};
		const [app, blockchain] = createTestServer();
		await request(app).post('/mine').send(body).expect(302);
		expect(blockchain.chain).toHaveLength(2);
		expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
			body.data
		);
	});
});
