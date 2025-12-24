const { Blockchain, Transaction, Block } = require("./blockchain");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "04ad3e7ced050a5dfc5d1d533e3df10d3a5ef0b125dffb204bb0ee9dcd9798c2a3db96a6f77ae7085160f823d437bb98119a3b895142ab0d7bcda9a05bc21fedfe"
);
const myWalletAddress = myKey.getPublic("hex");

let savjeeCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public-key goes here", 10);
tx1.signTransaction(myKey);
savjeeCoin.addTransaction(tx1);

console.log("\n Starting the miner...");
savjeeCoin.minePendingTransactions(myWalletAddress);

console.log("\n Starting the miner AGAIN..."); // İkinci madencilik
savjeeCoin.minePendingTransactions(myWalletAddress);

console.log(
  "\n Balance of Xavier is",
  savjeeCoin.getBalanceOfAddress(myWalletAddress)
);

console.log("Is chain valid?", savjeeCoin.isChainValid() ? "Yes" : "No");

// console.log("\n Starting the miner...");
// savjeeCoin.minePendingTransactions("xavier-address");

// console.log(
//   "\n Balance of xavier is",
//   savjeeCoin.getBalanceOfAddress("xavier-address")
// );

// let satoshi = new crypto.enc.Hex("04e3352fd58e0431b46ff411d672287b56d9517b9c948127319a09a7a36deac8245a686b10c9089c2324b4697600950c0e1f5fcd");

// savjeeCoin.createTransaction(new Transaction(null, satoshi.toString(crypto.enc.Hex), 100));

// console.log("Is blockchain valid?", savjeeCoin.isChainValid() ? "Yes" : "No");

// console.log(JSON.stringify(savjeeCoin, null, 4));

// console.log("Mining block 1...");
// savjeeCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));

// console.log("Mining block 2...");
// savjeeCoin.addBlock(new Block(2, "10/07/2017", { amount: 8 }));

// console.log("Mining block 3...");
// savjeeCoin.addBlock(new Block(3, "10/07/2017", { amount: 12 }));

// console.log("Is blockchain valid?", savjeeCoin.isChainValid() ? "Yes" : "No");

// savjeeCoin.chain[1].data = { amount: 1000 };
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

// console.log("Is blockchain valid?", savjeeCoin.isChainValid() ? "Yes" : "No");

// console.log(JSON.stringify(savjeeCoin, null, 4));
