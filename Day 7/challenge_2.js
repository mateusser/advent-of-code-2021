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

  let initialCrabsPosition
  for await (const line of rl) {
    initialCrabsPosition = line
      .split(',')
      .map(d => parseInt(d))
      .sort((a, b) => a - b)
  }

  const MAX_POSITION = initialCrabsPosition[initialCrabsPosition.length - 1]
  const crabs = new Array(MAX_POSITION + 1).fill(0)

  while(initialCrabsPosition.length) {
    crabs[initialCrabsPosition.shift()]++
  }

  console.log(crabs)

  let bestPosition = -1
  let minimalFuel = Number.MAX_SAFE_INTEGER
  for (let i = 2; i < crabs.length; i++) {
    const beforePosition = crabs.slice(0, i)
    const afterPosition = crabs.slice(i + 1)

    const crabsBeforeFuel = beforePosition.reduce((acc, curr, idx) => {
      return acc + ((i - idx) * (1 + i - idx) / 2 * curr)
    }, 0)
    const crabsAfterFuel = afterPosition.reduce((acc, curr, idx) => {
      return acc + ((idx + 1) * (1 + idx + 1) / 2 * curr)
    }, 0)

    const positionFuel = crabsBeforeFuel + crabsAfterFuel
    if (positionFuel < minimalFuel) {
      minimalFuel = positionFuel
      bestPosition = i
    }
  }

  console.log("\n")
  console.log('bestPosition ->', bestPosition)
  console.log('Result ->', minimalFuel)
  console.log("\n")
}

processLineByLine()
