import { Wallet } from '../../src/wallet/Wallet';
import { newTransaction } from '../../src/transaction/transactionUtils';

const recipientAddress = 'recipient';
const wallet = new Wallet();

describe('transactionUtils', () => {
	describe('newTransaction', () => {
		it('creates transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 200);
			expect(transaction).toEqual({
				id: expect.any(String),
				input: '',
				outputs: [
					{
						amount: 300,
						address: wallet.publicKey
					},
					{
						amount: 200,
						address: recipientAddress
					}
				]
			});
		});

		it('exceeds sender balance and cannot create transaction', () => {
			throw new Error();
		});
	});
});
