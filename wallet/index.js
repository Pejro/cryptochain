const { ec, cryptoHash } = require("../util");
const { STARTING_BALANCE } = require("../config");

// Eliptic cryptography based on Mathematical objects - Eliptic curve

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;

    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
}

module.exports = Wallet;
