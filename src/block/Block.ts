import { BlockData } from '../types/blockTypes';

export class Block {
	constructor(
		public readonly data: BlockData,
		public readonly timestamp: string,
		public readonly lastHash: string,
		public readonly nonce: number,
		public readonly difficulty: number,
		public readonly hash: string
	) {}

	toString(): string {
		return `Block - 
			Timestamp : ${this.timestamp}
			Last Hash : ${this.lastHash}
			Hash      : ${this.hash}
			Nonce     : ${this.nonce}
			Difficulty: ${this.difficulty}
			Data      : ${JSON.stringify(this.data)}`;
	}
}
