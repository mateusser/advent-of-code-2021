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
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4
  }

  let sumList = []
  for await (const line of rl) {
    const characters = line.split('')

    const stack = []

    while (characters.length) {
      const currentChar = characters.shift()

      if (charactersMap[currentChar]) {
        stack.push(currentChar)
      } else {
        const stackTop = stack.pop()
        if (currentChar !== charactersMap[stackTop]) {
          break
        }
      }
    }

    if (characters.length) {
      continue
    }

    let sum = 0
    while(stack.length) {
      const currentChar = stack.pop()
      sum *= 5
      sum += points[currentChar]
    }
    sumList.push(sum)
  }

  console.log('\n')
  console.log('Result ->', sumList.sort((a, b) => a - b)[Math.floor(sumList.length / 2)])
  console.log('\n')
}

processLineByLine()
