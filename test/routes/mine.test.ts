import {createTestServer} from '../testutils/testServer';
import request from 'supertest';

describe('mine', () => {
	it('creates a new block on the blockchain', async () => {
		const body = {
			data: []
		};
		const [app, blockchain] = createTestServer();
		const response = await request(app)
			.post('/mine')
			.send(body)
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(blockchain.chain).toHaveLength(2);
		expect(response.body).toEqual(blockchain.chain);
	});
});
