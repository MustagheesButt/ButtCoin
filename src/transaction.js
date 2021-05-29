import { SHA256 } from "./util"
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

export default class Transaction {
    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     * @param {Date} timestamp
     */
    constructor(fromAddress, toAddress, amount, timestamp=Date.now) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = timestamp
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString()
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress)
            throw new Error("Can't sign transactions for other wallets")

        const hashTx = this.calculateHash()
        const sign = signingKey.sign(hashTx, 'base64')

        this.signature = sign.toDER('hex')
    }

    isValid() {
        if (this.fromAddress === null) return true

        if (!this.signature || this.signature.length === 0) throw new Error('No signature in this transaction')

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}