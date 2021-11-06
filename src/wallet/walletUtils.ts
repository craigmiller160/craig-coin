import { ec } from 'elliptic';

// TODO unify all logic using this ec constructor
const ecInstance = new ec('secp256k1');

export const genKeyPair = (): ec.KeyPair => ecInstance.genKeyPair();
