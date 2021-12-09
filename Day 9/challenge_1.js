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

  const heightMap = []
  for await (const line of rl) {
    const lineNumbers = line.split('').map(n => parseInt(n))

    heightMap.push(lineNumbers)
  }

  let sumRisk = 0
  const MAP_SIZE = heightMap.length
  for(let i = 0; i < MAP_SIZE; i++) {
    for(let j = 0; j < MAP_SIZE; j++) {
      const currentHeight = heightMap[i][j]

      const top = i > 0 ? heightMap[i-1][j] : 9
      const bottom = i < MAP_SIZE - 1 ? heightMap[i+1][j] : 9
      const left = j > 0 ? heightMap[i][j-1] : 9
      const right = j < MAP_SIZE - 1 ? heightMap[i][j+1] : 9

      const neighbors = [top, bottom, left, right]
      const isLowestPoint = !neighbors.some(value => value <= currentHeight)

      if (isLowestPoint) {
        sumRisk += (currentHeight + 1)
      }
    }
  }

  console.log('\n')
  console.log('Result ->', sumRisk)
  console.log('\n')
}

processLineByLine()
