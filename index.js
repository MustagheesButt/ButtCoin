import { SHA256, timeDiff } from './util.js'


class Block {
    constructor(index, timestamp, data, previousHash='') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.nonce = 0

        this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        const start = new Date()
        while(this.hash.substr(0, difficulty) !== "0".repeat(difficulty)) {
            this.nonce++
            this.hash = this.calculateHash()
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 4
    }

    createGenesisBlock() {
        return new Block(0, new Date("01/01/2021"), "Genesis block", '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty, true)

        this.chain.push(newBlock)
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash())
                return false

            if (currentBlock.previousHash !== previousBlock.hash)
                return false
        }

        return true
    }
}

const buttCoin = new Blockchain()

console.log("Mining block 1...")
let start = new Date()
buttCoin.addBlock(new Block(1, new Date(), { amount: 100, from: "0x111", to: "0x222" }))
console.log(`Block mined: ${buttCoin.chain[1].hash}`)
console.log(`Took ${timeDiff(start)}s`)

console.log("Mining block 2...")
start = new Date()
buttCoin.addBlock(new Block(2, new Date(), { amount: 250, from: "0x111", to: "0x222" }))
console.log(`Block mined: ${buttCoin.chain[2].hash}`)
console.log(`Took ${timeDiff(start)}s`)

// console.log(JSON.stringify(buttCoin, null, 4))
console.log("Validating chain...")
console.log(buttCoin.isChainValid())

// tamper data (wont work for last)
buttCoin.chain[1].data = { amount: 1000, from: "0x111", to: "0x222" }
buttCoin.chain[1].hash = buttCoin.chain[1].calculateHash()
console.log("Validating chain...")
console.log(buttCoin.isChainValid())