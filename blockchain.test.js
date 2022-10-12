const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain = new Blockchain();

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it(`contains a 'chain' Array instance'`, () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("start with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  // Chain validation
  describe("isValidChain()", () => {
    // Chain start with genesis block
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    // Chain start with genesis block and has multiple blocks
    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      // There are two occasions when blockchain might have invalid block, 1. if lastHash has not changed, or 2. block includes incorrect data
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Beets" });
        blockchain.addBlock({ data: "Battlestars" });
      });
      // Hash of the last block has changed
      describe("and a lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      // Chain does not include invalid block (manipulated data)
      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "evil-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      // Chain does not include any invalid block
      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });
});
