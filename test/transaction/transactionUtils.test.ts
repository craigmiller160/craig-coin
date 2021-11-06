import { Wallet } from '../../src/wallet/Wallet';
import { newTransaction } from '../../src/transaction/transactionUtils';
import '@relmify/jest-fp-ts';

const recipientAddress = 'recipient';
const wallet = new Wallet();

describe('transactionUtils', () => {
	describe('newTransaction', () => {
		it('creates transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 200);
			expect(transaction).toEqualRight({
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
			const transaction = newTransaction(wallet, recipientAddress, 700);
			expect(transaction).toEqualLeft(
				new Error(`Amount 700 exceeds sender balance`)
			);
		});
	});
});
