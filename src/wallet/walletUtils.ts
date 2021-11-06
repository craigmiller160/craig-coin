import { ec } from 'elliptic';
import { nanoid } from 'nanoid';

const ecInstance = new ec('secp256k1');

export const genKeyPair = (): ec.KeyPair => ecInstance.genKeyPair();

// TODO need test
export const id = () => nanoid();
