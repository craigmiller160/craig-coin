import {
	adjustDifficulty,
	genesisBlock,
	hash,
	hashBlock,
	mineBlock
} from '../../src/block/blockUtils';
import { Block } from '../../src/block/Block';
import { verifyTimestamp } from '../testutils/utilityFunctions';
import { DIFFICULTY } from '../../src/config';
import { millisToTimestamp } from '../../src/utils/dateUtils';

describe('blockUtils', () => {
	it('genesisBlock', () => {
		const block = genesisBlock();

		expect(block.timestamp).toEqual('0');
		expect(block.lastHash).toEqual('----');
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
		expect(block.nonce).toEqual(0);
		expect(block.difficulty).toEqual(DIFFICULTY);
	});

	describe('adjustDifficulty', () => {
		it('lowers difficulty for slowly mined blocks', () => {
			const lastMillis = Date.now();
			const lastBlock = new Block(
				[],
				millisToTimestamp(lastMillis),
				'lastHash',
				0,
				DIFFICULTY,
				'hash'
			);

			const newDifficulty = adjustDifficulty(
				lastBlock,
				millisToTimestamp(lastMillis + 36000)
			);
			expect(newDifficulty).toEqual(1);
		});

		it('raises difficulty for quickly mined blocks', () => {
			const lastMillis = Date.now();
			const lastBlock = new Block(
				[],
				millisToTimestamp(lastMillis),
				'lastHash',
				0,
				DIFFICULTY,
				'hash'
			);

			const newDifficulty = adjustDifficulty(
				lastBlock,
				millisToTimestamp(lastMillis - 36000)
			);
			expect(newDifficulty).toEqual(3);
		});
	});

	it('mineBlock', () => {
		const lastBlock = new Block([], '0', 'lastHash', 0, DIFFICULTY, 'hash');
		const block = mineBlock(lastBlock, []);
		verifyTimestamp(block.timestamp);
		expect(block.lastHash).toEqual(lastBlock.hash);
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
		expect(block.hash.substring(0, block.difficulty)).toEqual(
			'0'.repeat(block.difficulty)
		);
	});

	it('hash', () => {
		const theHash = hash([], 'timestamp', 'lastHash', 0, DIFFICULTY);
		expect(theHash).toEqual(
			'8ef6f25e2e87229014eea59a054e94c674b16a74f0b1e0ba67561a549173ff4a'
		);
	});

	it('hashBlock', () => {
		const block = new Block(
			[],
			'timestamp',
			'lastHash',
			0,
			DIFFICULTY,
			'hash'
		);
		const hash = hashBlock(block);
		expect(hash).toEqual(
			'8ef6f25e2e87229014eea59a054e94c674b16a74f0b1e0ba67561a549173ff4a'
		);
	});
});
