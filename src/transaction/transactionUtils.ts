import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';
import * as E from 'fp-ts/Either';
import { createTimestamp } from '../utils/dateUtils';
import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';
import { hashData, verifySignature } from '../utils/cryptoUtils';
import { signData } from '../wallet/walletUtils';

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
	return E.right(new Transaction(input, outputs));
};

const createTransactionInput = (
	senderWallet: Wallet,
	outputs: ReadonlyArray<TransactionOutput>
): TransactionInput => ({
	timestamp: createTimestamp(),
	amount: senderWallet.balance,
	address: senderWallet.publicKey,
	// TODO why does the input signature sign the outputs?
	signature: signData(senderWallet, hashData(outputs))
});

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
	const input: TransactionInput = createTransactionInput(
		senderWallet,
		newOutputs
	);
	return E.right(new Transaction(input, newOutputs, baseTransaction.id));
};

export const verifyTransaction = (transaction: Transaction): boolean =>
	verifySignature(
		transaction.input.address,
		transaction.input.signature,
		hashData(transaction.outputs)
	);
