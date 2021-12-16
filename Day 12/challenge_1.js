const fs = require('fs')
const readline = require('readline')

const addConnection = (connections, from, to) => {
  if (connections[from] == undefined) {
    connections[from] = [to]
  } else {
    connections[from].push(to)
  }
}

const isUpperCased = string => string.toUpperCase() == string

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv.slice(2)[0])

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in the input as a single line break.

  const connections = {}

  for await (const line of rl) {
    const caves = line.split('-')
    addConnection(connections, caves[0], caves[1])
    addConnection(connections, caves[1], caves[0])
  }
  
  const toExplore = [['start']]
  const paths = []
  
  while (toExplore.length > 0) {
    const currPath = toExplore.pop()
    const currLastPlace = currPath.at(-1)
  
    if (currLastPlace == 'end') {
      paths.push(currPath)
      continue
    }

    connections[currLastPlace].forEach(neighbour => {
      if (neighbour == 'start') {
        return
      }
      if (!isUpperCased(neighbour) && currPath.includes(neighbour)) {
        return
      }
      toExplore.push([...currPath, neighbour])
    })
  }
  
  console.log('\n')
  console.log('Result ->', paths.length)
  console.log('\n')
}

processLineByLine()
