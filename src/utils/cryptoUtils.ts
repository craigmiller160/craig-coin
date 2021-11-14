import { ec } from 'elliptic';
import SHA256 from 'crypto-js/sha256';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';

const ecInstance = new ec('secp256k1');

export const genKeyPair = (): ec.KeyPair => ecInstance.genKeyPair();

export const verifySignature = (
	publicKeyString: string,
	signature: string,
	dataHash: string
): boolean =>
	pipe(
		E.tryCatch(
			() => {
				const publicKey = ecInstance.keyFromPublic(
					publicKeyString,
					'hex'
				);
				return publicKey.verify(dataHash, signature);
			},
			(error: unknown) => error as Error
		),
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
	E.tryCatch(
		() => SHA256(JSON.stringify(data)).toString(),
		(error: unknown) => error as Error
	);

export const hashText = (text: string): E.Either<Error, string> =>
	E.tryCatch(
		() => SHA256(text).toString(),
		(error: unknown) => error as Error
	);
