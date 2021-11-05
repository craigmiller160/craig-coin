import { Block } from './Block';
import { createTimestamp } from '../utils/dateUtils';
import { BlockData } from '../types/blockTypes';
import SHA256 from 'crypto-js/sha256';

export const DIFFICULTY = 4;

export const genesisBlock = (): Block => {
	const timestamp = '0';
	const data: BlockData = [];
	const lastHash = '----';
	const theHash = hash(0, timestamp, lastHash, data);
	return new Block(timestamp, lastHash, theHash, 0, data);
};

export const mineBlock = (lastBlock: Block, data: BlockData): Block => {
	let nonce = 0;
	let theHash = '';
	let timestamp = '';

	do {
		timestamp = createTimestamp();
		theHash = hash(nonce, timestamp, lastBlock.hash, data);
		nonce++;
	} while (theHash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

	return new Block(timestamp, lastBlock.hash, theHash, nonce, data);
};

export const hash = (
	nonce: number,
	timestamp: string,
	lastHash: string,
	data: BlockData
): string =>
	SHA256(nonce + timestamp + lastHash + JSON.stringify(data)).toString();

export const hashBlock = (block: Block): string =>
	hash(block.nonce, block.timestamp, block.lastHash, block.data);
