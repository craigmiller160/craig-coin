import { Block } from './Block';
import { createTimestamp, timestampToMillis } from '../utils/dateUtils';
import { INITIAL_DIFFICULTY, MINE_RATE } from '../config';
import { hashText } from '../utils/cryptoUtils';
import { BlockData } from './BlockData';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';

export const blockToString = (block: Block): string =>
	`Block - 
		Data      : ${JSON.stringify(block.data)}
		Timestamp : ${block.timestamp}
		Last Hash : ${block.lastHash}
		Nonce     : ${block.nonce}
		Difficulty: ${block.difficulty}
		Hash      : ${block.hash}`;

export const genesisBlock = (): E.Either<Error, Block> => {
	const timestamp = '0';
	const data: BlockData = [];
	const lastHash = '----';

	return pipe(
		hash(data, timestamp, lastHash, 0, INITIAL_DIFFICULTY),
		E.map((hash) => ({
			data,
			timestamp,
			lastHash,
			nonce: 0,
			difficulty: INITIAL_DIFFICULTY,
			hash
		}))
	);
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

export const mineBlock = (
	lastBlock: Block,
	data: BlockData
): E.Either<Error, Block> => {
	let nonce = 0;
	let theHash: E.Either<Error, string> = E.right('');
	let timestamp = createTimestamp();
	const difficulty = adjustDifficulty(lastBlock, timestamp);

	do {
		nonce++;
		timestamp = createTimestamp();
		theHash = hash(data, timestamp, lastBlock.hash, nonce, difficulty);
	} while (
		pipe(
			theHash,
			E.fold(
				(error) => {
					logger.error('Error mining block');
					logger.error(error);
					return false;
				},
				(hash: string) =>
					hash.substring(0, difficulty) !== '0'.repeat(difficulty)
			)
		)
	);

	return pipe(
		theHash,
		E.map((hash) => ({
			data,
			timestamp,
			lastHash: lastBlock.hash,
			nonce,
			difficulty,
			hash
		}))
	);
};

export const hash = (
	data: BlockData,
	timestamp: string,
	lastHash: string,
	nonce: number,
	difficulty: number
): E.Either<Error, string> =>
	hashText(nonce + timestamp + lastHash + JSON.stringify(data) + difficulty);

export const hashBlock = (block: Block): E.Either<Error, string> =>
	hash(
		block.data,
		block.timestamp,
		block.lastHash,
		block.nonce,
		block.difficulty
	);
