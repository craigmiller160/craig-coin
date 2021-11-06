import { ec } from 'elliptic';
import SHA256 from 'crypto-js/sha256';

const ecInstance = new ec('secp256k1');

// TODO migrate tests
export const genKeyPair = (): ec.KeyPair => ecInstance.genKeyPair();

// TODO write tests
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
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const hashData = (data: object | any[]): string =>
	SHA256(JSON.stringify(data)).toString();

// TODO write tests
export const hashText = (text: string): string => SHA256(text).toString();
