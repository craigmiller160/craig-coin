import { Block } from './Block';
import { createTimestamp } from '../utils/dateUtils';
import { BlockData } from '../types/blockTypes';
import SHA256 from 'crypto-js/sha256';

export const genesisBlock = (): Block => {
	const timestamp = createTimestamp();
	const data: BlockData = [];
	const lastHash = '----';
	const hash = hashBlock(timestamp, lastHash, data);
	return new Block(timestamp, lastHash, hash, data);
};

export const mineBlock = (lastBlock: Block, data: BlockData): Block => {
	const timestamp = createTimestamp();
	const hash = hashBlock(timestamp, lastBlock.hash, data);
	return new Block(timestamp, lastBlock.hash, hash, data);
};

export const hashBlock = (
	timestamp: string,
	lastHash: string,
	data: BlockData
): string => SHA256(timestamp + lastHash + JSON.stringify(data)).toString();
