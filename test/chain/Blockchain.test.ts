import {Blockchain} from '../../src/chain/Blockchain';
import {verifyTs} from '../testutils/utilityFunctions';

describe('Blockchain', () => {
	it('starts with genesis block', () => {
		const blockchain = new Blockchain();
		expect(blockchain.chain).toHaveLength(1);

		const genesisBlock = blockchain.chain[0];
		verifyTs(genesisBlock.timestamp);
		expect(genesisBlock.lastHash).toEqual('----');
		expect(genesisBlock.data).toEqual([]);
		expect(genesisBlock.hash).toHaveLength(64);
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
