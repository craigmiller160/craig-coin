import { ec } from 'elliptic';

const ecInstance = new ec('secp256k1');

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
