import { Block } from './Block';
import { createTimestamp } from './utils/createTimestamp';

const block = new Block(createTimestamp(), 'abc', 'def', 'Hello World');

console.log(block);
