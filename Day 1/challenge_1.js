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

  let previousMeasurement = Number.MAX_SAFE_INTEGER
  let count = 0
  for await (const line of rl) {
    const currentMeasurement = parseInt(line)
    if (currentMeasurement > previousMeasurement) {
      count++
    }
   previousMeasurement = currentMeasurement
  }
  console.log("\n")
  console.log(count)
  console.log("\n")
}

processLineByLine()
