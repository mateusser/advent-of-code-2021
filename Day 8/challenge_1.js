const fs = require('fs')
const readline = require('readline')

/**
 * Seven segments display
 * 0 - 6 segments
 * 1 - 2 segments
 * 2 - 5 segments
 * 3 - 5 segments
 * 4 - 4 segments
 * 5 - 5 segments
 * 6 - 6 segments
 * 7 - 3 segments
 * 8 - 7 segments
 * 9 - 6 segments
 */

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv.slice(2)[0])

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in the input as a single line break.

  let count = 0
  for await (const line of rl) {
    count = line
      .split(' | ')[1]
      .split(' ')
      .reduce((acc, digitsArray) => {
        if (
          digitsArray.length === 2 || // 1
          digitsArray.length === 4 || // 4
          digitsArray.length === 3 || // 7
          digitsArray.length === 7    // 8
        ) {
          acc++
        }

        return acc
      }, count)
  }

  console.log("\n")
  console.log('Result ->', count)
  console.log("\n")
}

processLineByLine()
