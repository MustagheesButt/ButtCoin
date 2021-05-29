import Transaction from './src/transaction'
import Blockchain from './src/blockchain'
import { ec as EC } from 'elliptic'


const ec = new EC('secp256k1')

const privateKey = ec.keyFromPrivate("0fca665ee300c79df2b5a838831c753aeead536b0224af0f7e0fd5de83138213")
const walletAddress = privateKey.getPublic('hex')

const buttCoin = new Blockchain()

const tx1 = new Transaction(walletAddress, 'to1', 250)
const tx2 = new Transaction(walletAddress, 'to1', 25)
tx1.signTransaction(privateKey)
tx2.signTransaction(privateKey)

buttCoin.addTransaction(tx1)
buttCoin.addTransaction(tx2)

console.log('Starting mining operation...')
buttCoin.minePendingTransactions(walletAddress)

console.log(`Balance of ${walletAddress}: ${buttCoin.getBalanceOfAddress(walletAddress)}`)
console.log(`Balance of to1: ${buttCoin.getBalanceOfAddress('to1')}`)

console.log("Is chain valid?", buttCoin.isChainValid())
buttCoin.chain[1].transactions[1].amount = 5
console.log("Is chain valid?", buttCoin.isChainValid())
