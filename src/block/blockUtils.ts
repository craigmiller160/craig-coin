import { Block } from './Block';
import { createTimestamp, millisFromTimestamp } from '../utils/dateUtils';
import { BlockData } from '../types/blockTypes';
import SHA256 from 'crypto-js/sha256';
import { DIFFICULTY, MINE_RATE } from '../config';

export const genesisBlock = (): Block => {
	const timestamp = '0';
	const data: BlockData = [];
	const lastHash = '----';
	const theHash = hash(0, timestamp, lastHash, data, DIFFICULTY);
	return new Block(timestamp, lastHash, theHash, 0, data);
};

// TODO write test
export const adjustDifficulty = (
	lastBlock: Block,
	currentTimestamp: string
): number => {
	const { difficulty, timestamp: lastBlockTimestamp } = lastBlock;
	const lastBlockMillis = millisFromTimestamp(lastBlockTimestamp);
	const currentMillis = millisFromTimestamp(currentTimestamp);
	// TODO this seems like it would make things too easy?
	return lastBlockMillis + MINE_RATE > currentMillis
		? difficulty + 1
		: difficulty - 1;
};

// TODO need a test that handles adjusting the difficulty
export const mineBlock = (lastBlock: Block, data: BlockData): Block => {
	let nonce = 0;
	let theHash = '';
	let timestamp = '';
	let { difficulty } = lastBlock;

	do {
		nonce++;
		timestamp = createTimestamp();
		difficulty = adjustDifficulty(lastBlock, timestamp);
		theHash = hash(nonce, timestamp, lastBlock.hash, data, difficulty);
	} while (theHash.substring(0, difficulty) !== '0'.repeat(difficulty));

	return new Block(
		timestamp,
		lastBlock.hash,
		theHash,
		nonce,
		data,
		difficulty
	);
};

// TODO clean up method param order
export const hash = (
	nonce: number,
	timestamp: string,
	lastHash: string,
	data: BlockData,
	difficulty: number
): string =>
	SHA256(
		nonce + timestamp + lastHash + JSON.stringify(data) + difficulty
	).toString();

export const hashBlock = (block: Block): string =>
	hash(
		block.nonce,
		block.timestamp,
		block.lastHash,
		block.data,
		block.difficulty
	);
