import { Block } from '../block/Block';
import { genesisBlock, hashBlock } from '../block/blockUtils';

export const isValidChain = (chain: Block[]): boolean => {
	if (JSON.stringify(genesisBlock()) !== JSON.stringify(chain[0])) {
		return false;
	}

	return chain.reduce((valid: boolean, block, index, currentChain) => {
		if (!valid) {
			return false;
		}
		const lastBlock = currentChain[index];
		return (
			block.lastHash === lastBlock.hash && block.hash === hashBlock(block)
		);
	}, true);
};
