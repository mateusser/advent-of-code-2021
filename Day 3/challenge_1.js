const fs = require('fs')
const readline = require('readline')

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv.slice(2)[0])

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in the input as a single line break.

  let zeroesCount, onesCount
  for await (const line of rl) {
    const number = line.split('')

    if (zeroesCount === undefined) {
      zeroesCount = new Array(number.length).fill(0)
    }
    if (onesCount === undefined) {
      onesCount = new Array(number.length).fill(0)
    }

    for (let i = 0; i < number.length; i++) {
      const bit = number[i]

      if (bit === '0') {
        zeroesCount[i]++
      } else if (bit === '1') {
        onesCount[i]++
      }
    }
  }

  let gammaBinaryString = ''
  let epsilonBinaryString = ''
  for (let j = 0; j < zeroesCount.length; j++) {
    if (zeroesCount[j] > onesCount[j]) {
      gammaBinaryString += '0'
      epsilonBinaryString += '1'
    } else {
      gammaBinaryString += '1'
      epsilonBinaryString += '0'
    }
  }

  const gamma = parseInt(gammaBinaryString, 2)
  const epsilon = parseInt(epsilonBinaryString, 2)

  console.log("\n")
  console.log('gamma:', gamma)
  console.log('epsilon:', epsilon)
  console.log('Result:', gamma*epsilon)
  console.log("\n")
}

processLineByLine()
