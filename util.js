export const timeDiff = (startTime) => {
    if (startTime instanceof Date) startTime = startTime.getTime()

    return ((new Date.getTime()) - startTime)/1000
}