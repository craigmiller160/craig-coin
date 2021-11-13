import { TransactionOutput } from './TransactionOutput';
import { TransactionInput } from './TransactionInput';

export interface Transaction {
	readonly input: TransactionInput;
	readonly outputs: ReadonlyArray<TransactionOutput>;
	readonly id: string;
}
