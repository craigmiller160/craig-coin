import { BlockData } from './BlockData';

export interface Block {
	readonly data: BlockData;
	readonly timestamp: string;
	readonly lastHash: string;
	readonly nonce: number;
	readonly difficulty: number;
	readonly hash: string;
}
