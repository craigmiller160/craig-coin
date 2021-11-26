/* eslint-disable */
import { ec } from 'elliptic';

// TODO delete this file

const ecInstance = new ec('secp256k1');
const keyPair = ecInstance.genKeyPair();
const pubString = keyPair.getPublic(false, 'hex');
const privString = keyPair.getPrivate('hex');
console.log('Public', pubString);
console.log('Private', privString);

const keyPair2 = ecInstance.keyFromPrivate(privString, 'hex');
console.log('Public2', keyPair2.getPublic('hex'));
console.log('Private2', keyPair2.getPrivate('hex'));

const keyPair3 = ecInstance.keyFromPublic(pubString, 'hex');
console.log('Public3', keyPair3.getPublic('hex'));
console.log('Private3', keyPair3.getPrivate('hex'));
