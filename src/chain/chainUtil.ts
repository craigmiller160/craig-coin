import { ec } from 'elliptic';

// TODO need a new name for this file
// TODO need tests for this file

const ecInstance = new ec('secp256k1');

export const genKeyPair = (): ec.KeyPair => ecInstance.genKeyPair();
