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

  const listOfNumbers = []
  for await (const line of rl) {
    listOfNumbers.push(line)
  }
  listOfNumbers.sort((a, b) => a.localeCompare(b))

  // doing first split separately
  let zeroesCount = 0
  let onesCount = 0
  for (let i = 0; i < listOfNumbers.length; i++) {
    const bit = listOfNumbers[i][0]

    if (bit === '0') {
      zeroesCount++
    } else if (bit === '1') {
      onesCount++
    }
  }

  const o2GeneratorList = []
  const co2ScrubberList = []
  if (zeroesCount > onesCount) {
    o2GeneratorList.push(...listOfNumbers.slice(0, zeroesCount))
    co2ScrubberList.push(...listOfNumbers.slice(zeroesCount))
  } else {
    o2GeneratorList.push(...listOfNumbers.slice(zeroesCount))
    co2ScrubberList.push(...listOfNumbers.slice(0, zeroesCount))
  }

  // getting o2Generator number
  for (let i = 1; i < o2GeneratorList[0].length; i++) {
    zeroesCount = 0
    onesCount = 0
    for (let j = 0; j < o2GeneratorList.length; j++) {
      const bit = o2GeneratorList[j][i]

      if (bit === '0') {
        zeroesCount++
      } else if (bit === '1') {
        onesCount++
      }
    }

    if (zeroesCount > onesCount) {
      o2GeneratorList.splice(zeroesCount, onesCount)
    } else {
      o2GeneratorList.splice(0, zeroesCount)
    }

    if(o2GeneratorList.length === 1) {
      break
    }
  }

  // getting co2Scrubber number
  for (let i = 1; i < co2ScrubberList[0].length; i++) {
    zeroesCount = 0
    onesCount = 0
    for (let j = 0; j < co2ScrubberList.length; j++) {
      const bit = co2ScrubberList[j][i]

      if (bit === '0') {
        zeroesCount++
      } else if (bit === '1') {
        onesCount++
      }
    }

    if (onesCount >= zeroesCount) {
      co2ScrubberList.splice(zeroesCount, onesCount)
    } else {
      co2ScrubberList.splice(0, zeroesCount)
    }

    if(co2ScrubberList.length === 1) {
      break
    }
  }
  
  const o2Generator = parseInt(o2GeneratorList[0], 2)
  const co2Scrubber = parseInt(co2ScrubberList[0], 2)

  console.log("\n")
  console.log('o2Generator:', o2Generator)
  console.log('co2Scrubber:', co2Scrubber)
  console.log('Result:', o2Generator*co2Scrubber)
  console.log("\n")
}

processLineByLine()
