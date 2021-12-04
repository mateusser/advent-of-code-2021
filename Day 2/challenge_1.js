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

  let horizontal = 0
  let depth = 0
  for await (const line of rl) {
    const [direction, valueString] = line.split(' ')
    const valueNumber = parseInt(valueString)
    
    if (direction === 'forward') {
      horizontal += valueNumber
    } else if (direction === 'down') {
      depth += valueNumber
    } else if (direction === 'up') {
      depth -= valueNumber
    }

    depth = Math.max(0, depth)
  }

  console.log("\n")
  console.log('horizontal:', horizontal)
  console.log('depth:', depth)
  console.log('Result:', horizontal*depth)
  console.log("\n")
}

processLineByLine()
