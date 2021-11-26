import os from 'os';
import path from 'path';
import fs from 'fs';
import * as E from 'fp-ts/Either';

const DATA_DIR_ROOT = path.resolve(os.homedir(), '.craigcoin');
const dataDirPath = !!process.env.DATA_DIR_NAME
	? path.resolve(DATA_DIR_ROOT, process.env.DATA_DIR_NAME)
	: DATA_DIR_ROOT;
const keyDirPath = path.resolve(dataDirPath, 'keys');
const publicKeyPath = path.resolve(keyDirPath, 'public.pem');
const privateKeyPath = path.resolve(keyDirPath, 'private.pem');

const keyFilesExist = (): boolean =>
	fs.existsSync(path.resolve(publicKeyPath)) &&
	fs.existsSync(path.resolve(privateKeyPath));

const loadKeys = (): E.Either<Error, [string,string]> => {
    // TODO finish this
};

const saveKeys = (publicKey: string, privateKey: string) => {
    // TODO finish this
}

export const setupWallet = () => {
	if (keyFilesExist()) {
        loadKeys();
    } else {
        // TODO gen keys and save them
    }
};
