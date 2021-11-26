import path from 'path';
import os from 'os';

const DATA_DIR_ROOT = path.resolve(os.homedir(), '.craigcoin');
export const DATA_DIR_PATH = !!process.env.DATA_DIR_NAME
	? path.resolve(DATA_DIR_ROOT, process.env.DATA_DIR_NAME)
	: DATA_DIR_ROOT;
