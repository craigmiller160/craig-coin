import { BlockData } from '../types/blockTypes';
import { DIFFICULTY } from '../config';

export class Block {
	// TODO clean up constructor param order
	constructor(
		public readonly timestamp: string,
		public readonly lastHash: string,
		public readonly hash: string,
		public readonly nonce: number,
		public readonly data: BlockData,
		public readonly difficulty: number = DIFFICULTY
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
