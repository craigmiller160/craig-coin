import os from 'os';
import path from 'path';
import fs from 'fs';

const DATA_DIR_ROOT = path.resolve(os.homedir(), '.craigcoin');
const dataDirPath = !!process.env.DATA_DIR_NAME
	? path.resolve(DATA_DIR_ROOT, process.env.DATA_DIR_NAME)
	: DATA_DIR_ROOT;

export const setupWallet = () => {
	// TODO finish this
};
