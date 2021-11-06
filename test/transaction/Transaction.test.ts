import { Transaction } from '../../src/transaction/Transaction';

describe('Transaction', () => {
	it('toString', () => {
		const outputs = [
			{
				amount: 1,
				address: 'a'
			}
		];
		const transaction = new Transaction(outputs);
		expect(transaction.toString()).toEqual(`Transaction - 
		id     : ${transaction.id}
		input  : 
		outputs: ${JSON.stringify(outputs, null, 2)}`);
	});
});
