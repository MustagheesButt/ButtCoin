import Block from './block'
import Transaction from './transaction'

export default class Blockchain {
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
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)

        this.chain.push(block)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress)
            throw new Error("fromAddress and toAddress must be defined")

        if (!transaction.isValid())
            throw new Error("Transaction Invalid: Failed to add transaction!")

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

            if (!currentBlock.hasValidTransactions())
                return false

            if (currentBlock.hash !== currentBlock.calculateHash())
                return false

            if (currentBlock.previousHash !== previousBlock.hash)
                return false
        }

        return true
    }
}