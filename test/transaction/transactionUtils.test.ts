import { Wallet } from '../../src/wallet/Wallet';
import { newTransaction } from '../../src/transaction/transactionUtils';
import '@relmify/jest-fp-ts';
import { TransactionInput } from '../../src/transaction/TransactionInput';
import SHA256 from 'crypto-js/sha256';

const recipientAddress = 'recipient';
const wallet = new Wallet();

describe('transactionUtils', () => {
	describe('newTransaction', () => {
		it('creates transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 200);
			const outputs = [
				{
					amount: 300,
					address: wallet.publicKey
				},
				{
					amount: 200,
					address: recipientAddress
				}
			];
			const input: TransactionInput = {
				timestamp: expect.any(String),
				amount: wallet.balance,
				address: wallet.publicKey,
				signature: wallet.sign(
					SHA256(JSON.stringify(outputs)).toString()
				)
			};
			expect(transaction).toEqualRight({
				id: expect.any(String),
				input,
				outputs
			});
		});

		it('exceeds sender balance and cannot create transaction', () => {
			const transaction = newTransaction(wallet, recipientAddress, 700);
			expect(transaction).toEqualLeft(
				new Error(`Amount 700 exceeds sender balance`)
			);
		});
	});

	describe('verifyTransaction', () => {
		it('valid transaction', () => {
			throw new Error();
		});

		it('invalid transaction', () => {
			throw new Error();
		});
	});
});
