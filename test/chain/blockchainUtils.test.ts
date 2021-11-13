import { Block } from '../../src/block/Block';
import { isValidChain } from '../../src/chain/blockchainUtils';
import { createChain } from '../testutils/utilityFunctions';
import { DIFFICULTY } from '../../src/config';

describe('blockchainUtils', () => {
	describe('isValidChain', () => {
		it('is valid', () => {
			const chain = createChain();
			expect(isValidChain(chain)).toEqual(true);
		});

		it('invalid genesis block', () => {
			const newGenesis: Block = {
				data: [],
				timestamp: 'timestamp',
				lastHash: 'lastHash',
				nonce: 0,
				difficulty: DIFFICULTY,
				hash: 'hash'
			};
			const chain = createChain();
			chain[0] = newGenesis;
			expect(isValidChain(chain)).toEqual(false);
		});

		it('invalid block in chain', () => {
			const newBlock: Block = {
				data: [],
				timestamp: 'timestamp',
				lastHash: 'lastHash',
				nonce: 0,
				difficulty: DIFFICULTY,
				hash: 'hash'
			};
			const chain = createChain();
			chain.push(newBlock);
			expect(isValidChain(chain)).toEqual(false);
		});
	});
});
