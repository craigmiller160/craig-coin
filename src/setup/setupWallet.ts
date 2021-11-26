import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { genKeyPair, getKeyPairFromPrivate } from '../utils/cryptoUtils';
import { Wallet } from '../wallet/Wallet';
import { keyFileExists, loadPrivateKey, savePrivateKey } from '../io/keys';

// TODO write test
export const setupWallet = (): E.Either<Error, Wallet> => {
	if (keyFileExists()) {
		return pipe(
			loadPrivateKey(),
			E.chain((privateKey) => getKeyPairFromPrivate(privateKey)),
			E.map((keyPair) => new Wallet(keyPair))
		);
	}

	return pipe(
		genKeyPair(),
		E.chain((keyPair) =>
			pipe(
				savePrivateKey(keyPair.getPrivate('hex')),
				E.map(() => keyPair)
			)
		),
		E.map((keyPair) => new Wallet(keyPair))
	);
};
