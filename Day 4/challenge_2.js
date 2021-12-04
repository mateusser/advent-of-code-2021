const fs = require('fs')
const readline = require('readline')

class BingoBoard {
  constructor (numbers) {
    this.numbers = numbers.map(num => parseInt(num))
  }

  markNumber (number) {
    const idx = this.numbers.findIndex((n) => n === number)
    if (idx !== -1) {
      this.numbers[idx] = 'X'
      return true
    }

    return false
  }

  checkIfWinner () {
    const rows = []
    rows.push(this.numbers.slice(0, 5))
    rows.push(this.numbers.slice(5, 10))
    rows.push(this.numbers.slice(10, 15))
    rows.push(this.numbers.slice(15, 20))
    rows.push(this.numbers.slice(20))

    const columns = []
    columns.push(this.numbers.filter((_n, idx) => idx % 5 === 0))
    columns.push(this.numbers.filter((_n, idx) => idx % 5 === 1))
    columns.push(this.numbers.filter((_n, idx) => idx % 5 === 2))
    columns.push(this.numbers.filter((_n, idx) => idx % 5 === 3))
    columns.push(this.numbers.filter((_n, idx) => idx % 5 === 4))

    for (let i = 0; i < 5; i++) {
      const marksOnRow = rows[i].reduce(
        (acc, curr) => curr === 'X' ? ++acc : acc, 0
      )

      const marksOnColumn = columns[i].reduce(
        (acc, curr) => curr === 'X' ? ++acc : acc, 0
      )

      if (marksOnRow === 5 || marksOnColumn === 5) {
        return true
      }
    }

    return false
  }

  print () {
    console.log(
      this.numbers[0].toString().padStart(2, ' '),
      this.numbers[1].toString().padStart(2, ' '),
      this.numbers[2].toString().padStart(2, ' '),
      this.numbers[3].toString().padStart(2, ' '),
      this.numbers[4].toString().padStart(2, ' ')
    )
    console.log(
      this.numbers[5].toString().padStart(2, ' '),
      this.numbers[6].toString().padStart(2, ' '),
      this.numbers[7].toString().padStart(2, ' '),
      this.numbers[8].toString().padStart(2, ' '),
      this.numbers[9].toString().padStart(2, ' ')
    )
    console.log(
      this.numbers[10].toString().padStart(2, ' '),
      this.numbers[11].toString().padStart(2, ' '),
      this.numbers[12].toString().padStart(2, ' '),
      this.numbers[13].toString().padStart(2, ' '),
      this.numbers[14].toString().padStart(2, ' ')
    )
    console.log(
      this.numbers[15].toString().padStart(2, ' '),
      this.numbers[16].toString().padStart(2, ' '),
      this.numbers[17].toString().padStart(2, ' '),
      this.numbers[18].toString().padStart(2, ' '),
      this.numbers[19].toString().padStart(2, ' ')
    )
    console.log(
      this.numbers[20].toString().padStart(2, ' '),
      this.numbers[21].toString().padStart(2, ' '),
      this.numbers[22].toString().padStart(2, ' '),
      this.numbers[23].toString().padStart(2, ' '),
      this.numbers[24].toString().padStart(2, ' ')
    )
    console.log('\n')
  }

  getSumUnmarked () {
    return this.numbers.reduce(
      (acc, curr) => curr === 'X' ? acc : acc + curr
    , 0)
  }
}

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv.slice(2)[0])

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in the input as a single line break.

  const drawOrder = []
  const boardNumbers = []
  const boardsList = []
  let i = 0
  for await (const line of rl) {
    if (i === 0) {
      drawOrder.push(...line.split(','))
      i++
      continue
    }

    if (line === '') continue

    if (boardNumbers.length !== 25) {
      boardNumbers.push(...line.split(' ').filter(i => i))
    }
    
    if (boardNumbers.length === 25) {
      boardsList.push(new BingoBoard(boardNumbers))
      boardNumbers.length = 0
    }
  }

  while (drawOrder.length) {
    const numberDrawn = parseInt(drawOrder.shift())
      for (let i = 0; i < boardsList.length; i++) {
        const board = boardsList[i]
        board.markNumber(numberDrawn)

        if (boardsList.length === 1 && boardsList[0].checkIfWinner()) {
          console.log("\n")
          boardsList[0].print() 
          const sumUnmarked = boardsList[0].getSumUnmarked()
          console.log('numberDrawn:', numberDrawn)
          console.log('sumUnmarked:', sumUnmarked)
          console.log('Result:', sumUnmarked*numberDrawn)
          console.log("\n")
          return
        }

        if (board.checkIfWinner()) {
          boardsList.splice(i, 1)
          i = 0
        }
    } 
  }
}

processLineByLine()
