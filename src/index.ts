import { Block } from './Block';
import { createTimestamp } from './utils/createTimestamp';

const genesis = Block.genesis();
const block = new Block(createTimestamp(), 'abc', 'def', ['Hello World']);

console.log(genesis);
console.log(block);
