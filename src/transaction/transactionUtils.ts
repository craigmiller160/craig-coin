import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';

export const newTransaction = (
	senderWallet: Wallet,
	recipientAddress: string,
	amount: number
): Transaction => {
	if (amount > senderWallet.balance) {
		// TODO modify for functional error handling
		throw new Error(`Amount ${amount} exceeds sender balance`);
	}

	return new Transaction([
		{
			// TODO wouldn't it just be -amount instead of the new balance?
			amount: senderWallet.balance - amount,
			address: senderWallet.publicKey
		},
		{
			amount,
			address: recipientAddress
		}
	]);
};
