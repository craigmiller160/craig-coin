import { Wallet } from './Wallet';
import { TransactionPool } from '../transaction/TransactionPool';
import * as E from 'fp-ts/Either';
import { Transaction } from '../transaction/Transaction';
import {
	newTransaction,
	updateTransaction
} from '../transaction/transactionUtils';
import { pipe } from 'fp-ts/function';

export const walletToString = (wallet: Wallet): string =>
	`Wallet - 
		publicKey: ${wallet.publicKey}
		balance  : ${wallet.balance}`;

export const signData = (
	wallet: Wallet,
	dataHash: string
): E.Either<Error, string> =>
	E.tryCatch(
		() => wallet.keyPair.sign(dataHash).toDER('hex'),
		(error: unknown) => error as Error
	);

export const createTransaction = (
	wallet: Wallet,
	transactionPool: TransactionPool,
	recipient: string,
	amount: number
): E.Either<Error, Transaction> => {
	if (amount > wallet.balance) {
		return E.left(
			new Error(
				`Amount ${amount} exceeds the current balance ${wallet.balance}`
			)
		);
	}

	const existingIndex = transactionPool.getExistingTransactionIndex(
		wallet.publicKey
	);
	const transactionEither =
		existingIndex >= 0
			? updateTransaction(
					transactionPool.transactions[existingIndex],
					wallet,
					recipient,
					amount
			  )
			: newTransaction(wallet, recipient, amount);

	return pipe(
		transactionEither,
		E.map((theNewTransaction) => {
			transactionPool.updateOrAddTransaction(theNewTransaction);
			return theNewTransaction;
		})
	);
};
