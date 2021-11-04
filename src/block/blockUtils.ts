import { Block } from './Block';
import { createTimestamp } from '../utils/dateUtils';
import { BlockData } from '../types/blockTypes';
import SHA256 from 'crypto-js/sha256';

export const genesisBlock = (): Block => {
	const timestamp = createTimestamp();
	const data: BlockData = [];
	const lastHash = '----';
	const theHash = hash(timestamp, lastHash, data);
	return new Block(timestamp, lastHash, theHash, data);
};

export const mineBlock = (lastBlock: Block, data: BlockData): Block => {
	const timestamp = createTimestamp();
	const theHash = hash(timestamp, lastBlock.hash, data);
	return new Block(timestamp, lastBlock.hash, theHash, data);
};

export const hash = (
	timestamp: string,
	lastHash: string,
	data: BlockData
): string => SHA256(timestamp + lastHash + JSON.stringify(data)).toString();

export const hashBlock = (block: Block): string =>
	hash(block.timestamp, block.lastHash, block.data);
