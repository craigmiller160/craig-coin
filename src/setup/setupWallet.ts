import os from 'os';
import path from 'path';
import fs from 'fs';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';
import { pipe } from 'fp-ts/function';
import { genKeyPair, getKeyPairFromPrivate } from '../utils/cryptoUtils';
import { Wallet } from '../wallet/Wallet';

const DATA_DIR_ROOT = path.resolve(os.homedir(), '.craigcoin');
const dataDirPath = !!process.env.DATA_DIR_NAME
	? path.resolve(DATA_DIR_ROOT, process.env.DATA_DIR_NAME)
	: DATA_DIR_ROOT;
const keyDirPath = path.resolve(dataDirPath, 'keys');
const privateKeyPath = path.resolve(keyDirPath, 'privateKey.pem');

// TODO move a lot of this into IO files and write tests

const keyFileExists = (): boolean =>
	fs.existsSync(path.resolve(privateKeyPath));

const loadPrivateKey = (): E.Either<Error, string> =>
	E.tryCatch(() => fs.readFileSync(privateKeyPath, 'utf8'), unknownToError);

const savePrivateKey = (privateKey: string): E.Either<Error, void> =>
	E.tryCatch(
		() => fs.writeFileSync(privateKeyPath, privateKey),
		unknownToError
	);

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
