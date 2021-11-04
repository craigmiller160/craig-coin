export class Block {
	constructor(
		public timestamp: string,
		public lastHash: string,
		public hash: string,
		public data: any // TODO want a type for this
	) {}
}
