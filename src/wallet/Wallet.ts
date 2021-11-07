import { INITIAL_BALANCE } from '../config';
import { ec } from 'elliptic';
import { genKeyPair } from '../utils/cryptoUtils';
import { Transaction } from '../transaction/Transaction';
import { TransactionPool } from '../transaction/TransactionPool';
import {
	newTransaction,
	updateTransaction
} from '../transaction/transactionUtils';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

export class Wallet {
	readonly balance = INITIAL_BALANCE;
	readonly keyPair: ec.KeyPair = genKeyPair();
	readonly publicKey = this.keyPair.getPublic().encode('hex', false);

	sign(dataHash: string): string {
		return this.keyPair.sign(dataHash).toDER('hex');
	}

	// TODO write tests
	createTransaction(
		recipient: string,
		amount: number,
		transactionPool: TransactionPool
	): E.Either<Error, Transaction> {
		// TODO refactor this to avoid looking up the existing transaction twice
		if (amount > this.balance) {
			return E.left(
				new Error(
					`Amount ${amount} exceeds the current balance ${this.balance}`
				)
			);
		}

		return pipe(
			O.fromNullable(
				transactionPool.getExistingTransaction(this.publicKey)
			),
			O.fold(
				() => newTransaction(this, recipient, amount),
				(transaction: Transaction) =>
					updateTransaction(transaction, this, recipient, amount)
			),
			E.map((theNewTransaction) => {
				transactionPool.updateOrAddTransaction(theNewTransaction);
				return theNewTransaction;
			})
		);
	}

	toString(): string {
		return `Wallet - 
		publicKey: ${this.publicKey}
		balance  : ${this.balance}`;
	}
}
