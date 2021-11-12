import { Block } from './Block';
import { createTimestamp, timestampToMillis } from '../utils/dateUtils';
import { DIFFICULTY, MINE_RATE } from '../config';
import { hashText } from '../utils/cryptoUtils';
import { BlockData } from './BlockData';

export const genesisBlock = (): Block => {
	const timestamp = '0';
	const data: BlockData = [];
	const lastHash = '----';
	const theHash = hash(data, timestamp, lastHash, 0, DIFFICULTY);
	return new Block(data, timestamp, lastHash, 0, DIFFICULTY, theHash);
};

export const adjustDifficulty = (
	lastBlock: Block,
	currentTimestamp: string
): number => {
	const { difficulty, timestamp: lastBlockTimestamp } = lastBlock;
	const lastBlockMillis = timestampToMillis(lastBlockTimestamp);
	const currentMillis = timestampToMillis(currentTimestamp);
	return lastBlockMillis + MINE_RATE > currentMillis
		? difficulty + 1
		: difficulty - 1;
};

export const mineBlock = (lastBlock: Block, data: BlockData): Block => {
	let nonce = 0;
	let theHash = '';
	let timestamp = '';
	let { difficulty } = lastBlock;

	do {
		nonce++;
		timestamp = createTimestamp();
		difficulty = adjustDifficulty(lastBlock, timestamp);
		theHash = hash(data, timestamp, lastBlock.hash, nonce, difficulty);
	} while (theHash.substring(0, difficulty) !== '0'.repeat(difficulty));

	return new Block(
		data,
		timestamp,
		lastBlock.hash,
		nonce,
		difficulty,
		theHash
	);
};

export const hash = (
	data: BlockData,
	timestamp: string,
	lastHash: string,
	nonce: number,
	difficulty: number
): string =>
	hashText(nonce + timestamp + lastHash + JSON.stringify(data) + difficulty);

export const hashBlock = (block: Block): string =>
	hash(
		block.data,
		block.timestamp,
		block.lastHash,
		block.nonce,
		block.difficulty
	);
