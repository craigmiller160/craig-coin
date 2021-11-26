import path from 'path';
import { getDataDirPath } from './constants';
import fs from 'fs';
import * as E from 'fp-ts/Either';
import { unknownToError } from '../utils/unknownToError';

const getKeyDirPath = () => path.resolve(getDataDirPath(), 'keys');

const getPrivateKeyPath = () => path.resolve(getKeyDirPath(), 'privateKey.pem');

export const keyFileExists = (): boolean => fs.existsSync(getPrivateKeyPath());

export const loadPrivateKey = (): E.Either<Error, string> =>
	E.tryCatch(
		() => fs.readFileSync(getPrivateKeyPath(), 'utf8'),
		unknownToError
	);

export const savePrivateKey = (privateKey: string): E.Either<Error, void> =>
	E.tryCatch(() => {
		if (!fs.existsSync(getKeyDirPath())) {
			fs.mkdirSync(getKeyDirPath());
		}
		fs.writeFileSync(getPrivateKeyPath(), privateKey);
	}, unknownToError);
