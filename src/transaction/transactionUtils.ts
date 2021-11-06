import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';
import * as E from 'fp-ts/Either';

export const newTransaction = (
	senderWallet: Wallet,
	recipientAddress: string,
	amount: number
): E.Either<Error, Transaction> => {
	if (amount > senderWallet.balance) {
		// TODO modify for functional error handling
		return E.left(new Error(`Amount ${amount} exceeds sender balance`));
	}

	return E.right(
		new Transaction([
			{
				// TODO wouldn't it just be -amount instead of the new balance?
				amount: senderWallet.balance - amount,
				address: senderWallet.publicKey
			},
			{
				amount,
				address: recipientAddress
			}
		])
	);
};
