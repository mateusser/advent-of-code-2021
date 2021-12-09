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

  const MAP_SIZE = heightMap.length

  const findBasin = (heightMap, x, y) => {
    if (x < 0) return 0
    if (y < 0) return 0
    if (x >= MAP_SIZE) return 0
    if (y >= MAP_SIZE) return 0
    if (heightMap[y][x] === 9) return 0

    heightMap[y][x] = 9
    return (
      1 +
      // Left
      findBasin(heightMap, x - 1, y) +
      // Top
      findBasin(heightMap, x, y - 1) +
      // Right
      findBasin(heightMap, x + 1, y) +
      // Bottom
      findBasin(heightMap, x, y + 1)
    )
  }
  const allBasins = heightMap.reduce((all, row, y) => {
    const basins = row.reduce((all, _cell, x) => {
      const size = findBasin(heightMap, x, y)
      return [...all, size]
    }, [])
    return [...all, ...basins]
  }, [])
  const sorted = allBasins.sort((a, b) => b - a)

  console.log('\n')
  console.log('Result ->', sorted[0] * sorted[1] * sorted[2])
  console.log('\n')
}

processLineByLine()
