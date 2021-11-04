import { Blockchain } from '../../src/chain/Blockchain';
import express from 'express';
import { configureGetBlocks } from '../../src/routes/getBlocks';
import request from 'supertest';

const blockchain = new Blockchain();
const app = express();
configureGetBlocks(app, blockchain);

describe('getBlocks', () => {
	it('returns blocks from blockchain', async () => {
		const response = await request(app)
			.get('/blocks')
			.expect('Content-Type', /application\/json/)
			.expect(200);
		expect(response.body).toEqual(blockchain.chain);
	});
});
