import { Transaction } from '../../src/transaction/Transaction';
import { TransactionInput } from '../../src/transaction/TransactionInput';

describe('Transaction', () => {
	it('toString', () => {
		const input: TransactionInput = {
			timestamp: expect.any(String),
			amount: 10,
			address: 'address',
			signature: 'signature'
		};
		const outputs = [
			{
				amount: 1,
				address: 'a'
			}
		];
		const transaction = new Transaction(input, outputs);
		expect(transaction.toString()).toEqual(`Transaction - 
		id     : ${transaction.id}
		input  : ${JSON.stringify(input, null, 2)}
		outputs: ${JSON.stringify(outputs, null, 2)}`);
	});
});
