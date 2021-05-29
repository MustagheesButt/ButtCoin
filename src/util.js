import { createHash } from 'crypto'

export const SHA256 = (text) => {
    return createHash('sha256').update(text).digest('hex')
}

export const timeDiff = (startTime) => {
    if (startTime instanceof Date) startTime = startTime.getTime()

    return ((new Date().getTime()) - startTime)/1000
}