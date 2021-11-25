import request from 'supertest';
import { createTestServer } from '../testutils/createTestServer';

describe('blocks', () => {
	it('GET /blocks', async () => {
		const { app, blockchain } = createTestServer();
		const response = await request(app)
			.get('/blocks')
			.auth(
				process.env.BASIC_AUTH_USER ?? '',
				process.env.BASIC_AUTH_PASSWORD ?? ''
			)
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(response.body).toEqual(blockchain.chain);
	});
});
