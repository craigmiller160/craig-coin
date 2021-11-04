import {Block} from '../../src/block/Block';
import {genesisBlock, mineBlock} from '../../src/block/blockUtils';
import {isValidChain} from '../../src/chain/blockchainUtils';

describe('blockchainUtils', () => {
    describe('isValidChain', () => {
        it('is valid', () => {
            const chain: Block[] = [...new Array(3).keys()]
                .reduce((newArray, index) => {
                    const lastBlock = newArray[index];
                    const newBlock = mineBlock(lastBlock, [`${index}`]);
                    return [
                        ...newArray,
                        newBlock
                    ];
                }, [genesisBlock()]);
            console.log(chain);
            expect(isValidChain(chain)).toEqual(true);
        });

        it('invalid genesis block', () => {
            throw new Error();
        });

        it('invalid block in chain', () => {
            throw new Error();
        });
    });
});