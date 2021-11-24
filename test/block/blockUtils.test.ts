import {
	adjustDifficulty,
	blockToString,
	genesisBlock,
	hash,
	hashBlock,
	mineBlock
} from '../../src/block/blockUtils';
import { Block } from '../../src/block/Block';
import { unpackRight, verifyTimestamp } from '../testutils/utilityFunctions';
import { INITIAL_DIFFICULTY } from '../../src/config';
import { millisToTimestamp } from '../../src/utils/dateUtils';

describe('blockUtils', () => {
	it('blockToString', () => {
		const block: Block = {
			data: [],
			timestamp: 'timestamp',
			lastHash: 'lastHash',
			nonce: 1,
			difficulty: INITIAL_DIFFICULTY,
			hash: 'hash'
		};
		expect(blockToString(block)).toEqual(
			`Block - 
		Data      : []
		Timestamp : timestamp
		Last Hash : lastHash
		Nonce     : 1
		Difficulty: ${INITIAL_DIFFICULTY}
		Hash      : hash`
		);
	});

	it('genesisBlock', () => {
		const block = unpackRight(genesisBlock());

		expect(block.timestamp).toEqual('0');
		expect(block.lastHash).toEqual('----');
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
		expect(block.nonce).toEqual(0);
		expect(block.difficulty).toEqual(INITIAL_DIFFICULTY);
	});

	describe('adjustDifficulty', () => {
		it('lowers difficulty for slowly mined blocks', () => {
			const lastMillis = Date.now();
			const lastBlock: Block = {
				data: [],
				timestamp: millisToTimestamp(lastMillis),
				lastHash: 'lastHash',
				nonce: 0,
				difficulty: INITIAL_DIFFICULTY,
				hash: 'hash'
			};

			const newDifficulty = adjustDifficulty(
				lastBlock,
				millisToTimestamp(lastMillis + 36000)
			);
			expect(newDifficulty).toEqual(INITIAL_DIFFICULTY - 1);
		});

		it('raises difficulty for quickly mined blocks', () => {
			const lastMillis = Date.now();
			const lastBlock: Block = {
				data: [],
				timestamp: millisToTimestamp(lastMillis),
				lastHash: 'lastHash',
				nonce: 0,
				difficulty: INITIAL_DIFFICULTY,
				hash: 'hash'
			};

			const newDifficulty = adjustDifficulty(
				lastBlock,
				millisToTimestamp(lastMillis - 36000)
			);
			expect(newDifficulty).toEqual(INITIAL_DIFFICULTY + 1);
		});
	});

	it('mineBlock', () => {
		const lastBlock: Block = {
			data: [],
			timestamp: '0',
			lastHash: 'lastHash',
			nonce: 0,
			difficulty: INITIAL_DIFFICULTY,
			hash: 'hash'
		};
		const block = unpackRight(mineBlock(lastBlock, []));
		verifyTimestamp(block.timestamp);
		expect(block.lastHash).toEqual(lastBlock.hash);
		expect(block.data).toEqual([]);
		expect(block.hash).toHaveLength(64);
		expect(block.hash.substring(0, block.difficulty)).toEqual(
			'0'.repeat(block.difficulty)
		);
	});

	it('hash', () => {
		const theHash = unpackRight(
			hash([], 'timestamp', 'lastHash', 0, INITIAL_DIFFICULTY)
		);
		expect(theHash).toEqual(
			'6ab8514cad967fd6d5d3bb4e925c3a781659b47800ed52baea9176e5881ed3c3'
		);
	});

	it('hashBlock', () => {
		const block: Block = {
			data: [],
			timestamp: 'timestamp',
			lastHash: 'lastHash',
			nonce: 0,
			difficulty: INITIAL_DIFFICULTY,
			hash: 'hash'
		};
		const hash = unpackRight(hashBlock(block));
		expect(hash).toEqual(
			'6ab8514cad967fd6d5d3bb4e925c3a781659b47800ed52baea9176e5881ed3c3'
		);
	});
});
