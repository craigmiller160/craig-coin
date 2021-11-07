import { nanoid } from 'nanoid';
import { TransactionOutput } from './TransactionOutput';
import { TransactionInput } from './TransactionInput';

export class Transaction {
	constructor(
		public readonly input: TransactionInput,
		public readonly outputs: ReadonlyArray<TransactionOutput>,
		readonly id: string = nanoid()
	) {}

	toString(): string {
		return `Transaction - 
		id     : ${this.id}
		input  : ${JSON.stringify(this.input, null, 2)}
		outputs: ${JSON.stringify(this.outputs, null, 2)}`;
	}
}
