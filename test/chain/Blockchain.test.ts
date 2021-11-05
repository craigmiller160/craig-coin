import { Blockchain } from '../../src/chain/Blockchain';
import { createChain } from '../testutils/utilityFunctions';
import { Block } from '../../src/block/Block';
import { genesisBlock } from '../../src/block/blockUtils';

describe('Blockchain', () => {
	it('starts with genesis block', () => {
		const blockchain = new Blockchain();
		expect(blockchain.chain).toHaveLength(1);

		const genesisBlock = blockchain.chain[0];
		expect(genesisBlock.timestamp).toEqual('0');
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

	describe('replaceChain', () => {
		it('successful', () => {
			const blockchain = new Blockchain();
			const chain = createChain();
			// TODO dynamic difficulty is breaking the hashing behavior for validation here
			blockchain.replaceChain(chain);
			expect(blockchain.chain).toEqual(chain);
		});

		it('invalid chain', () => {
			const blockchain = new Blockchain();
			const chain = createChain();
			chain.push(genesisBlock());
			blockchain.replaceChain(chain);
			expect(blockchain.chain).toHaveLength(1);
			expect(blockchain.chain).not.toEqual(chain);
		});

		it('chain too short', () => {
			const blockchain = new Blockchain();
			const newChain: Block[] = [];
			blockchain.replaceChain(newChain);
			expect(blockchain.chain).toHaveLength(1);
			expect(blockchain.chain).not.toEqual(newChain);
		});
	});
});
