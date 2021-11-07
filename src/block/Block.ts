import { BlockData } from '../types/restTypes';

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
			Data      : ${JSON.stringify(this.data)}
			Timestamp : ${this.timestamp}
			Last Hash : ${this.lastHash}
			Nonce     : ${this.nonce}
			Difficulty: ${this.difficulty}
			Hash      : ${this.hash}`;
	}
}
