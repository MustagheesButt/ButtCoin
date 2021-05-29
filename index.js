import { SHA256, timeDiff } from './util.js'


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    constructor(timestamp, transactions, previousHash='') {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.nonce = 0

        this.hash = this.calculateHash()
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
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
        this.difficulty = 3
        this.pendingTransactions = []
        this.miningReward = 10
    }

    createGenesisBlock() {
        return new Block(new Date("01/01/2021"), "Genesis block", '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        const block = new Block(Date.now(), this.pendingTransactions)
        block.mineBlock(this.difficulty)
        block.previousHash = this.getLatestBlock().hash

        this.chain.push(block)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0

        for (const block of this.chain) {
            for (const trx of block.transactions) {
                if (trx.fromAddress === address)
                    balance -= trx.amount

                if (trx.toAddress === address)
                    balance += trx.amount
            }
        }

        return balance
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

buttCoin.createTransaction(new Transaction('from1', 'to1', 250))
buttCoin.createTransaction(new Transaction('to1', 'from1', 25))

console.log('Starting mining operation...')
buttCoin.minePendingTransactions('buttServer')

console.log(`Balance of buttServer: ${buttCoin.getBalanceOfAddress('buttServer')}`)
console.log(`Balance of to1: ${buttCoin.getBalanceOfAddress('to1')}`)
