import { createECDH } from 'crypto'

const ecdh = createECDH('secp256k1')
ecdh.generateKeys()

console.log(ecdh.getPrivateKey('hex'))
console.log(ecdh.getPublicKey('hex'))