import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';
import * as E from 'fp-ts/Either';
import { createTimestamp } from '../utils/dateUtils';
import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';
import { hashData, verifySignature } from '../utils/cryptoUtils';
import { nanoid } from 'nanoid';
import { pipe } from 'fp-ts/function';

export const transactionToString = (transaction: Transaction): string =>
	`Transaction - 
		id     : ${transaction.id}
		input  : ${JSON.stringify(transaction.input, null, 2)}
		outputs: ${JSON.stringify(transaction.outputs, null, 2)}`;

export const newTransaction = (
	senderWallet: Wallet,
	recipientAddress: string,
	amount: number
): E.Either<Error, Transaction> => {
	if (amount > senderWallet.balance) {
		return E.left(new Error(`Amount ${amount} exceeds sender balance`));
	}

	const outputs: ReadonlyArray<TransactionOutput> = [
		{
			// TODO wouldn't it just be -amount instead of the new balance?
			address: senderWallet.publicKey,
			amount: senderWallet.balance - amount
		},
		{
			address: recipientAddress,
			amount
		}
	];

	const input: TransactionInput = createTransactionInput(
		senderWallet,
		outputs
	);
	return E.right({
		input,
		outputs,
		id: nanoid()
	});
};

const createTransactionInput = (
	senderWallet: Wallet,
	outputs: ReadonlyArray<TransactionOutput>
): E.Either<Error, TransactionInput> =>
	pipe(
		signData(senderWallet, hashData(outputs)),
		E.map((signature) => ({
			timestamp: createTimestamp(),
			amount: senderWallet.balance,
			address: senderWallet.publicKey,
			signature
		}))
	);

export const updateTransaction = (
	baseTransaction: Transaction,
	senderWallet: Wallet,
	recipientAddress: string,
	amount: number
): E.Either<Error, Transaction> => {
	const senderOutputIndex = baseTransaction.outputs.findIndex(
		(output) => output.address === senderWallet.publicKey
	);

	if (senderOutputIndex < 0) {
		return E.left(
			new Error('Cannot find existing output for sender wallet to update')
		);
	}

	const senderOutput = baseTransaction.outputs[senderOutputIndex];
	if (amount > senderOutput.amount) {
		// The only senderOutput that would exist is one referencing the balance of the sender
		return E.left(new Error(`Amount ${amount} exceeds sender balance`));
	}

	const newSenderAmount = senderOutput.amount - amount;
	const newOutputs: ReadonlyArray<TransactionOutput> = [
		{
			address: senderWallet.publicKey,
			amount: newSenderAmount
		},
		...baseTransaction.outputs.slice(0, senderOutputIndex),
		...baseTransaction.outputs.slice(senderOutputIndex + 1),
		{
			address: recipientAddress,
			amount: amount
		}
	];

	return pipe(
		createTransactionInput(senderWallet, newOutputs),
		E.map((input) => ({
			id: baseTransaction.id,
			input,
			outputs: newOutputs
		}))
	);
};

export const verifyTransaction = (transaction: Transaction): boolean =>
	verifySignature(
		transaction.input.address,
		transaction.input.signature,
		hashData(transaction.outputs)
	);
