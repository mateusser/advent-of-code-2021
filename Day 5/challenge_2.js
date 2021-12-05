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

  const MAX_DISTANCE = 1000
  const points = new Array(MAX_DISTANCE)
  for (let i =0; i <  MAX_DISTANCE; i++) {
    points[i] = new Array(MAX_DISTANCE).fill(0)
  }

  for await (const line of rl) {
    const [p1, p2] = line.split(' -> ')
    const [x1, y1] = p1.split(',').map(p => parseInt(p))
    const [x2, y2] = p2.split(',').map(p => parseInt(p))

    if (x1 === x2) {
      if (y1 >= y2) {
        for (let i = y2; i <= y1; i++) {
          points[x1][i]++
        }
      } else if (y1 < y2) {
        for (let i = y1; i <= y2; i++) {
          points[x1][i]++
        }
      }
    } else if (y1 === y2) {
      if (x1 >= x2) {
        for (let i = x2; i <= x1; i++) {
          points[i][y1]++
        }
      } else if (x1 < x2) {
        for (let i = x1; i <= x2; i++) {
          points[i][y1]++
        }
      }
    } else {
      let directionX = Math.sign(x2 - x1)
      let directionY = Math.sign(y2 - y1)

      let x = x1
      let y = y1
      while (x !== (x2 + directionX) && y !== (y2 + directionY)) {
        points[x][y]++
        x += directionX
        y += directionY
      }
    }
  }

  let count = 0
  for (let i = 0; i < MAX_DISTANCE; i++) {
    for (let j = 0; j < MAX_DISTANCE; j++) {
      if (points[i][j] >= 2) count++
    }
  }

  console.log("\n")
  console.log('Result ->', count)
  console.log("\n")
}

processLineByLine()
