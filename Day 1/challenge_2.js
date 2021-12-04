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

  const MEASUREMENTS_NUMBER = 3
  let count = 0
  const windows = [[], [], [], []]
  let i = 0
  for await (const line of rl) {
    const currentMeasurement = parseInt(line)
    if (windows[0].length < MEASUREMENTS_NUMBER) {
      windows[0].push(currentMeasurement)
    }
    if (windows[1].length < MEASUREMENTS_NUMBER && i >= 1) {
      windows[1].push(currentMeasurement)
    }
    if (windows[2].length < MEASUREMENTS_NUMBER && i >= 2) {
      windows[2].push(currentMeasurement)
    }
    if (windows[3].length < MEASUREMENTS_NUMBER && i >= 3) {
      windows[3].push(currentMeasurement)
    }

    if (windows[0].length === MEASUREMENTS_NUMBER &&
        windows[1].length === MEASUREMENTS_NUMBER) {
      const sumPrevious = windows[0].reduce((acc, curr) => acc += curr, 0)
      const sumCurrent = windows[1].reduce((acc, curr) => acc += curr, 0)
      
      console.log(windows[0], sumPrevious)
      console.log(windows[1], sumCurrent)

      if (sumCurrent > sumPrevious) {
        count++
        console.log(count)
      }

      windows.shift()
      windows.push([])
    }

   i++
  }
  
  console.log("\n")
  console.log(count)
  console.log("\n")
}

processLineByLine()
