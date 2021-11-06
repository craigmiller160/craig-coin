import { ec } from 'elliptic';

const ecInstance = new ec('secp256k1');

export const genKeyPair = (): ec.KeyPair => ecInstance.genKeyPair();
