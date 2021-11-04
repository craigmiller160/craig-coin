import {
	genesisBlock,
	hash,
	hashBlock,
	mineBlock
} from '../../src/block/blockUtils';
import { Block } from '../../src/block/Block';
import { verifyTs } from '../testutils/utilityFunctions';

describe('blockUtils', () => {
	it('genesisBlock', () => {
		const block = genesisBlock();

		expect(block.timestamp).toEqual('0');
		expect(block.lastHash).toEqual('----');
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
	});

	it('mineBlock', () => {
		const lastBlock = new Block('timestamp', 'lastHash', 'hash', []);
		const block = mineBlock(lastBlock, []);
		verifyTs(block.timestamp);
		expect(block.lastHash).toEqual(lastBlock.hash);
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
	});

	it('hash', () => {
		const theHash = hash('timestamp', 'lastHash', []);
		expect(theHash).toEqual(
			'af5e8e66d42193775e16e0c701ce630760efc63f7c58843c7f3e6685640d7a59'
		);
	});

	it('hashBlock', () => {
		const block = new Block('timestamp', 'lastHash', 'hash', []);
		const hash = hashBlock(block);
		expect(hash).toEqual(
			'af5e8e66d42193775e16e0c701ce630760efc63f7c58843c7f3e6685640d7a59'
		);
	});
});
