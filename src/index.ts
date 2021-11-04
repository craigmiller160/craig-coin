import { Block } from './Block';

const genesis = Block.genesis();
const block = Block.mineBlock(genesis, ['Hello World']);

console.log(genesis);
console.log(block);
