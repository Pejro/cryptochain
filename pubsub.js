const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-c5bbdcba-579f-45b2-a610-4b1dbe87aa68",
  subscribeKey: "sub-c-62621ab9-9da9-4afc-9372-0a877eebc20b",
  secretKey: "sec-c-ZjlkNjA1N2YtNWUzYi00NWM1LWJiMzYtMjAwYTFiNjk5Y2M3",
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor(blockchain) {
    this.blockchain = blockchain;

    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
  }

  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(
          `Message received. Channel: ${channel}. Message: ${message}`
        );
        const parsedMessage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(parsedMessage);
        }
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.unsubscribeAll();
    setTimeout(() => this.pubnub.publish({ channel, message }), 1000);
    setTimeout(
      () => this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] }),
      6000
    );
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSub;
