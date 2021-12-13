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


  const charactersMap = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
  }

  const points = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  }

  let sum = 0
  const stack = []
  for await (const line of rl) {
    const characters = line.split('')

    while (characters.length) {
      const currentChar = characters.shift()

      if (charactersMap[currentChar]) {
        stack.push(currentChar)
      } else {
        const stackTop = stack.pop()
        if (currentChar !== charactersMap[stackTop]) {
          sum += points[currentChar]
        }
      }
    }
  }

  console.log('\n')
  console.log('Result ->', sum)
  console.log('\n')
}

processLineByLine()
