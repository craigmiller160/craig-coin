import { ec as EC } from 'elliptic';

// TODO need a new name for this file
// TODO need tests for this file

const ec = new EC('secp256k1');

export const genKeyPair = (): EC.KeyPair => ec.genKeyPair();
