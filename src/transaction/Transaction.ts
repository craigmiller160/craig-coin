import { nanoid } from 'nanoid';
import { TransactionOutput } from './TransactionOutput';
import { TransactionInput } from './TransactionInput';

export class Transaction {
	constructor(
		public readonly input: TransactionInput,
		public readonly outputs: ReadonlyArray<TransactionOutput>,
		readonly id: string = nanoid()
	) {}
}
