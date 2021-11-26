import path from 'path';
import os from 'os';

const DATA_DIR_ROOT = path.resolve(os.homedir(), '.craigcoin');

export const getDataDirPath = () => {
	if (!!process.env.DATA_DIR_NAME) {
		return path.resolve(DATA_DIR_ROOT, process.env.DATA_DIR_NAME);
	}
	return DATA_DIR_ROOT;
};
