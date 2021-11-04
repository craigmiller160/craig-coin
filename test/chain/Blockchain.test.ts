import { Blockchain } from '../../src/chain/Blockchain';

describe('Blockchain', () => {
	it('starts with genesis block', () => {
		throw new Error();
	});

	it('addBlock', () => {
		const blockchain = new Blockchain();
		expect(blockchain.chain).toHaveLength(1);

		const block = blockchain.addBlock([]);
		const lastBlock = blockchain.chain[blockchain.chain.length - 1];

		expect(blockchain.chain).toHaveLength(2);
		expect(JSON.stringify(block)).toEqual(JSON.stringify(lastBlock));
	});
});
