import { Wallet } from '../../src/wallet/Wallet';
import { Transaction } from './Transaction';

export const newTransaction = (
	senderWallet: Wallet,
	recipientAddress: string,
	amount: number
): Transaction => {
	const transaction = new Transaction();
	if (amount > senderWallet.balance) {
		// TODO modify for functional error handling
		throw new Error(`Amount ${amount} exceeds sender balance`);
	}

	transaction.outputs.push(
		...[
			{
				amount: senderWallet.balance - amount,
				address: senderWallet.publicKey
			},
			{
				amount,
				address: recipientAddress
			}
		]
	);
	return transaction;
};
