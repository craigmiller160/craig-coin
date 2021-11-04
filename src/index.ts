import { genesisBlock, mineBlock } from './block/blockUtils';

const genesis = genesisBlock();
const block = mineBlock(genesis, ['Hello World']);

console.error(genesis);
console.error(block);
