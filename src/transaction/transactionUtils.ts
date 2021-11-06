import { Wallet } from '../wallet/Wallet';
import { Transaction } from './Transaction';
import * as E from 'fp-ts/Either';
import { createTimestamp } from '../utils/dateUtils';
import SHA256 from 'crypto-js/sha256';
import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';
import { ec } from 'elliptic';

const ecInstance = new ec('secp256k1');

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
			amount: senderWallet.balance - amount,
			address: senderWallet.publicKey
		},
		{
			amount,
			address: recipientAddress
		}
	];

	const input: TransactionInput = {
		timestamp: createTimestamp(),
		amount: senderWallet.balance,
		address: senderWallet.publicKey,
		// TODO why does the input signature sign the outputs?
		signature: senderWallet.sign(SHA256(JSON.stringify(outputs)).toString())
	};

	return E.right(new Transaction(input, outputs));
};

// TODO write tests and move to EC utility file
export const verifySignature = (
	publicKeyString: string,
	signature: string,
	dataHash: string
): boolean => {
	// TODO need to handle exceptions here
	const publicKey = ecInstance.keyFromPublic(publicKeyString, 'hex');
	return publicKey.verify(dataHash, signature);
};

// TODO write tests
export const verifyTransaction = (transaction: Transaction): boolean =>
	verifySignature(
		transaction.input.address,
		transaction.input.signature,
		SHA256(JSON.stringify(transaction.outputs)).toString()
	);
