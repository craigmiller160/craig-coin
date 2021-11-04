import { genesisBlock, mineBlock } from './block/blockUtils';

const genesis = genesisBlock();
const block = mineBlock(genesis, ['Hello World']);

console.log(genesis);
console.log(block);
