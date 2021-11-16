import { Wallet } from './Wallet';
import { TransactionPool } from '../transaction/TransactionPool';
import * as E from 'fp-ts/Either';
import { Transaction } from '../transaction/Transaction';
import {
	newTransaction,
	updateTransaction
} from '../transaction/transactionUtils';
import { pipe } from 'fp-ts/function';
import { getExistingTransactionIndex } from '../transaction/transactionPoolUtils';
import { Blockchain } from '../chain/Blockchain';
import {compareTimestamps, millisToTimestamp} from '../utils/dateUtils';

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

export const calculateBalance = (
	wallet: Wallet,
	blockchain: Blockchain
): number => {
	let balance = wallet.balance;
	const transactions: Transaction[] = [];
	blockchain.chain.forEach((block) => {
		block.data.forEach((txn) => {
			transactions.push(txn);
		});
	});

	const walletInputTxns = transactions.filter(
		(txn) => txn.input.address === wallet.publicKey
	);

	let startTimestamp = millisToTimestamp(0);
	if (walletInputTxns.length > 0) {
		const recentInputTxn = walletInputTxns.reduce((prev, current) => {
			// There should never be equal timestamps
			if (compareTimestamps(prev.input.timestamp, current.input.timestamp) > 0) {
				return current;
			}
			return prev;
		});
		balance = recentInputTxn.outputs.find((output) => output.address === wallet.publicKey)?.amount ?? 0;
		startTimestamp = recentInputTxn.input.timestamp;
	}

	transactions.forEach((txn) => {
		if (compareTimestamps(startTimestamp, txn.input.timestamp) > 0) {
			txn.outputs.forEach((output) => {
				if (output.address === wallet.publicKey) {
					balance += output.amount;
				}
			});
		}
	});
	return balance;
};

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

	const existingIndex = getExistingTransactionIndex(
		transactionPool,
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
