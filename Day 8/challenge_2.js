const fs = require('fs')
const readline = require('readline')

/**
 * Seven segments display
 * 1 - 2 segments - cf
 * 7 - 3 segments - acf
 * 4 - 4 segments - bcdf
 * 2 - 5 segments - acdeg
 * 3 - 5 segments - acdfg
 * 5 - 5 segments - abdfg
 * 0 - 6 segments - abcefg
 * 6 - 6 segments - abdefg
 * 9 - 6 segments - abcdfg
 * 8 - 7 segments - abcdefg
 */

 const eqSet = (setA, setB) => {
  if (setA.size !== setB.size) return false;
  for (var a of setA) if (!setB.has(a)) return false;
  return true;
}

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv.slice(2)[0])

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in the input as a single line break.

  let digitsSum = 0
  for await (const line of rl) {
    const [blinks, displayDigits] = line
      .split(' | ')
      .map(side => side.split(' '))

    const patterns = blinks.map(blink => new Set(blink))
    const onePattern = patterns.find(p => p.size === 2)
		const sevenPattern = patterns.find(p => p.size === 3)
		const eightPattern = patterns.find(p => p.size === 7)
		const fourPattern = patterns.find(p => p.size === 4)
		const ninePattern = patterns.find(
      p => p.size === 6 && new Set([...p].filter(x => fourPattern.has(x))).size === 4
    )
		const zeroPattern = patterns.find(
      p => p.size === 6 && new Set([...p].filter(x => sevenPattern.has(x))).size === 3 && p != ninePattern
    )
		const sixPattern = patterns.find(
      p => p.size === 6 && p !== ninePattern && p != zeroPattern
    )
		const fivePattern = patterns.find(
      p => p.size === 5 && new Set([...p].filter(x => sixPattern.has(x))).size === 5
    )
		const threePattern = patterns.find(
      p => p.size === 5 && new Set([...p].filter(x => fourPattern.has(x))).size === 3 && p != fivePattern
    )
		const twoPattern = patterns.find(
      p => p.size === 5 && p !== fivePattern && p !== threePattern
    )

    const finder = [
			zeroPattern,
			onePattern,
			twoPattern,
			threePattern,
			fourPattern,
			fivePattern,
			sixPattern,
			sevenPattern,
			eightPattern,
			ninePattern,
		]

    let digits = displayDigits
      .map(displayDigit => new Set(displayDigit))
      .map(p => finder.findIndex(f => eqSet(f, p)))

		if (digits.some((d) => d === -1)) {
			throw new Error();
		}

		digitsSum += parseInt(digits.join(""));
  }

  console.log("\n")
  console.log('Result ->', digitsSum)
  console.log("\n")
}

processLineByLine()
