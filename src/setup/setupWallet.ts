import os from 'os';
import path from 'path';
import fs from 'fs';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';
import { pipe } from 'fp-ts/function';
import { genKeyPair, parseKeyPair } from '../utils/cryptoUtils';
import { Wallet } from '../wallet/Wallet';

const DATA_DIR_ROOT = path.resolve(os.homedir(), '.craigcoin');
const dataDirPath = !!process.env.DATA_DIR_NAME
	? path.resolve(DATA_DIR_ROOT, process.env.DATA_DIR_NAME)
	: DATA_DIR_ROOT;
const keyDirPath = path.resolve(dataDirPath, 'keys');
const publicKeyPath = path.resolve(keyDirPath, 'public.pem');
const privateKeyPath = path.resolve(keyDirPath, 'private.pem');

// TODO move a lot of this into IO files and write tests

const keyFilesExist = (): boolean =>
	fs.existsSync(path.resolve(publicKeyPath)) &&
	fs.existsSync(path.resolve(privateKeyPath));

const loadKeys = (): E.Either<Error, [string, string]> =>
	E.tryCatch(() => {
		const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
		const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
		return [publicKey, privateKey];
	}, unknownToError);

const saveKeys = (
	publicKey: string,
	privateKey: string
): E.Either<Error, void> =>
	E.tryCatch(() => {
		fs.writeFileSync(publicKeyPath, publicKey);
		fs.writeFileSync(privateKeyPath, privateKey);
	}, unknownToError);

export const setupWallet = (): E.Either<Error, Wallet> => {
	if (keyFilesExist()) {
		return pipe(
			loadKeys(),
			E.chain(([publicKey, privateKey]) =>
				parseKeyPair(publicKey, privateKey)
			),
			E.map((keyPair) => new Wallet(keyPair))
		);
	}

	return pipe(
		genKeyPair(),
		E.chain((keyPair) =>
			pipe(
				saveKeys(
					keyPair.getPublic().encode('hex', false),
					keyPair.getPrivate().encode('hex', false)
				),
				E.map(() => keyPair)
			)
		),
		E.map((keyPair) => new Wallet(keyPair))
	);
};
