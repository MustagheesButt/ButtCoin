import { createHash } from 'crypto'
import { timeDiff } from './util.js'


const SHA256 = (text) => {
    return createHash('sha256').update(text).digest('hex')
}

class Block {
    constructor(index, timestamp, data, previousHash='') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash

        this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock() {
        return new Block(0, new Date("01/01/2021"), "Genesis block", '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash()

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
buttCoin.addBlock(new Block(1, new Date(), { amount: 100, from: "0x111", to: "0x222" }))
buttCoin.addBlock(new Block(2, new Date(), { amount: 250, from: "0x111", to: "0x222" }))

console.log(JSON.stringify(buttCoin, null, 4))
console.log("Validating chain...")
console.log(buttCoin.isChainValid())

// tamper data (wont work for last)
buttCoin.chain[1].data = { amount: 1000, from: "0x111", to: "0x222" }
buttCoin.chain[1].hash = buttCoin.chain[1].calculateHash()
console.log("Validating chain...")
console.log(buttCoin.isChainValid())