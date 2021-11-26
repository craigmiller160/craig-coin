import path from 'path';
import { DATA_DIR_PATH } from './constants';
import fs from 'fs';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';

const keyDirPath = path.resolve(DATA_DIR_PATH, 'keys');
const privateKeyPath = path.resolve(keyDirPath, 'privateKey.pem');

export const keyFileExists = (): boolean =>
	fs.existsSync(path.resolve(privateKeyPath));

export const loadPrivateKey = (): E.Either<Error, string> =>
	E.tryCatch(() => fs.readFileSync(privateKeyPath, 'utf8'), unknownToError);

export const savePrivateKey = (privateKey: string): E.Either<Error, void> =>
	E.tryCatch(
		() => fs.writeFileSync(privateKeyPath, privateKey),
		unknownToError
	);
