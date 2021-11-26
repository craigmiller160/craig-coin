import { ec } from 'elliptic';
import SHA256 from 'crypto-js/sha256';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';
import { unknownToError } from './unknownToError';

const ecInstance = new ec('secp256k1');

export const genKeyPair = (): E.Either<Error, ec.KeyPair> =>
	E.tryCatch(() => ecInstance.genKeyPair(), unknownToError);

export const getKeyPairFromPrivate = (
	privateKey: string
): E.Either<Error, ec.KeyPair> =>
	E.tryCatch(() => ecInstance.keyFromPrivate(privateKey), unknownToError);

export const verifySignature = (
	publicKeyString: string,
	signature: string,
	dataHash: string
): boolean =>
	pipe(
		E.tryCatch(() => {
			const publicKey = ecInstance.keyFromPublic(publicKeyString, 'hex');
			return publicKey.verify(dataHash, signature);
		}, unknownToError),
		E.fold(
			(error: Error) => {
				logger.error('Error verifying signature', error);
				return false;
			},
			(result: boolean) => result
		)
	);

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const hashData = (data: object | any[]): E.Either<Error, string> =>
	E.tryCatch(() => SHA256(JSON.stringify(data)).toString(), unknownToError);

export const hashText = (text: string): E.Either<Error, string> =>
	E.tryCatch(() => SHA256(text).toString(), unknownToError);
