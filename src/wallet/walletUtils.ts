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
import { WalletSum } from './WalletSum';
import { unknownToError } from '../utils/unknownToError';

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
		unknownToError
	);

export const calculateBalance = (
	wallet: Wallet,
	blockchain: Blockchain
): number => {
	const walletOutputSum: WalletSum = [
		...new Array(blockchain.chain.length).keys()
	].reduce(
		(blockSum: WalletSum, baseBlockIndex) => {
			if (blockSum.inputFound) {
				return blockSum;
			}

			const blockIndex = blockchain.chain.length - baseBlockIndex - 1;
			const block = blockchain.chain[blockIndex];

			return [...new Array(block.data.length).keys()].reduce(
				(txnSum: WalletSum, baseTxnIndex) => {
					if (txnSum.inputFound) {
						return txnSum;
					}

					const txnIndex = block.data.length - baseTxnIndex - 1;
					const txn = block.data[txnIndex];

					const outputSum = txn.outputs.reduce(
						(outputSum, output) => {
							if (output.address === wallet.publicKey) {
								return outputSum + output.amount;
							}
							return outputSum;
						},
						0
					);

					return {
						inputFound: txn.input.address === wallet.publicKey,
						amount: txnSum.amount + outputSum
					};
				},
				blockSum
			);
		},
		{ amount: 0, inputFound: false }
	);

	return walletOutputSum.inputFound
		? walletOutputSum.amount
		: walletOutputSum.amount + wallet.balance;
};

export const createTransaction = (
	wallet: Wallet,
	blockchain: Blockchain,
	transactionPool: TransactionPool,
	recipient: string,
	amount: number
): E.Either<Error, Transaction> => {
	const balance = calculateBalance(wallet, blockchain);
	if (amount > balance) {
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
