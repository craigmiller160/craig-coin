export class Block {
	constructor(
		public timestamp: string, // TODO need to create this internally, but also prevent it from changing during mining if i make this immutable
		public lastHash: string,
		public hash: string,
		public data: any // TODO want a type for this
	) {}

	toString(): string {
		return `Block - 
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash}
			Hash     : ${this.hash}
			Data     : ${JSON.stringify(this.data)}`;
	}
}
