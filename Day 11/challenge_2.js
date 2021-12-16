const fs = require('fs')
const readline = require('readline')

/**
* Processes a single step for the grid.
* Returns the number of octopuses that flashed.
* @param {Array} grid
* @return {number}
*/
const doStep = (grid) => {
   // Count all flashes during the step
   let flashes = 0;

   // Increase all by 1
   for (let x = 0; x < grid.length; x++) {
       for (let y = 0; y < grid[0].length; y++) {
           grid[x][y]++;
       }
   }

   // Process until the step is done
   let flashed;
   do {
       flashed = false;

       // Tick each octopus
       for (let x = 0; x < grid.length; x++) {
           for (let y = 0; y < grid[0].length; y++) {
               // Check if the octopus is ready to flash
               if (grid[x][y] > 9) {
                   // Reset to 0
                   grid [x][y] = 0;

                   // Flash it
                   incrementInStep(grid, x - 1, y - 1);
                   incrementInStep(grid, x - 1, y);
                   incrementInStep(grid, x - 1, y + 1);
                   incrementInStep(grid, x, y - 1);
                   incrementInStep(grid, x, y + 1);
                   incrementInStep(grid, x + 1, y - 1);
                   incrementInStep(grid, x + 1, y);
                   incrementInStep(grid, x + 1, y + 1);

                   // Mark as flashed so that we continue the step
                   flashed = true;
                   flashes++;
               }
           }
       }
   } while (flashed);

   // Return the total number of flashes during this step
   return flashes;
}

/**
 * Increments the octopus as (x,y).
 * If x or y is out of bounds, then nothing happens.
 * Octopuses with a value of zero are not incremented
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 */
 function incrementInStep(grid, x, y) {
  if (x >= 0 && x < grid.length) {
      if (y >= 0 && y < grid[0].length) {
          // Don't increment 0, because that has already flashed this step
          if (grid[x][y] !== 0) {
              grid[x][y]++;
          }
      }
  }
}

const printArray = (array) => {
  for (let i = 0; i < array.length; i++) {
    console.log(...array[i])
  }
  console.log('')
}

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv.slice(2)[0])

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in the input as a single line break.


  const energyLevel = []
  for await (const line of rl) {
    const energy = line.split('').map(c => parseInt(c))

    energyLevel.push(energy)
  }

  for (let step = 0; step < 1000; step++) {
      if(doStep(energyLevel) === 100) {
        console.log('\n')
        console.log('Result ->', step + 1)
        console.log('\n')
        return
      }
  }

}

processLineByLine()
