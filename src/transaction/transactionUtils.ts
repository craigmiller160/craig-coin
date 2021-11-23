import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';
import * as E from 'fp-ts/Either';
import { createTimestamp } from '../utils/dateUtils';
import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';
import { hashData, verifySignature } from '../utils/cryptoUtils';
import { nanoid } from 'nanoid';
import { pipe } from 'fp-ts/function';
import { signData } from '../wallet/walletUtils';
import { MINING_REWARD } from '../config';
import { logger } from '../logger';

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
			address: senderWallet.publicKey,
			amount: senderWallet.balance - amount
		},
		{
			address: recipientAddress,
			amount
		}
	];

	return pipe(
		createTransactionInput(senderWallet, outputs),
		E.map((input) => ({
			input,
			outputs,
			id: nanoid()
		}))
	);
};

export const rewardTransaction = (
	minerWallet: Wallet,
	blockchainWallet: Wallet
): E.Either<Error, Transaction> => {
	const outputs: ReadonlyArray<TransactionOutput> = [
		{
			amount: MINING_REWARD,
			address: minerWallet.publicKey
		}
	];

	return pipe(
		createTransactionInput(blockchainWallet, outputs),
		E.map((input) => ({
			input,
			outputs,
			id: nanoid()
		}))
	);
};

const createTransactionInput = (
	senderWallet: Wallet,
	outputs: ReadonlyArray<TransactionOutput>
): E.Either<Error, TransactionInput> =>
	pipe(
		hashData(outputs),
		E.chain((hash) => signData(senderWallet, hash)),
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
	pipe(
		hashData(transaction.outputs),
		E.map((hash) =>
			verifySignature(
				transaction.input.address,
				transaction.input.signature,
				hash
			)
		),
		E.fold(
			(error) => {
				logger.error('Error creating hash for verifying transaction');
				logger.error(error);
				return false;
			},
			(verified) => verified
		)
	);
