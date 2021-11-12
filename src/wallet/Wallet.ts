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
import { pipe } from 'fp-ts/function';

export class Wallet {
	readonly balance = INITIAL_BALANCE;
	readonly keyPair: ec.KeyPair = genKeyPair();
	readonly publicKey = this.keyPair.getPublic().encode('hex', false);

	sign(dataHash: string): string {
		return this.keyPair.sign(dataHash).toDER('hex');
	}

	createTransaction(
		recipient: string,
		amount: number,
		transactionPool: TransactionPool
	): E.Either<Error, Transaction> {
		if (amount > this.balance) {
			return E.left(
				new Error(
					`Amount ${amount} exceeds the current balance ${this.balance}`
				)
			);
		}

		const existingIndex = transactionPool.getExistingTransactionIndex(
			this.publicKey
		);
		const transactionEither =
			existingIndex >= 0
				? updateTransaction(
						transactionPool.transactions[existingIndex],
						this,
						recipient,
						amount
				  )
				: newTransaction(this, recipient, amount);

		return pipe(
			transactionEither,
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
