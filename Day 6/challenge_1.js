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

  const TOTAL_DAYS = 80
  const MAX_TIMER = 8
  const MATURED_FISH_RESET = 6

  let initialFish
  for await (const line of rl) {
    initialFish = line
      .split(',')
      .map(d => parseInt(d))
      .sort((a, b) => a - b)
  }

  const currentFishPerDays = new Array(MAX_TIMER + 1).fill(0)

  let currentDays = 0
  while(initialFish.length) {
    const currentFishDays = initialFish.shift()
    if (currentFishDays > currentDays) {
      currentFishPerDays[currentDays + 1]++
      currentDays = currentFishDays
    } else  {
      currentFishPerDays[currentDays]++
    }
  }

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const replicatingFish = currentFishPerDays.shift()
    currentFishPerDays.push(0)
    currentFishPerDays[MAX_TIMER] += replicatingFish
    currentFishPerDays[MATURED_FISH_RESET] += replicatingFish
  }

  console.log("\n")
  console.log(
    'Result ->',
    currentFishPerDays.reduce((acc, curr) => acc += curr, 0)
  )
  console.log("\n")
}

processLineByLine()
