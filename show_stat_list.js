/**
 * This module will take in a flattened array and filter the `company` & location fields,
 * removing all \n & spaces in the beginining (the stuff that got mixed in from scraping)
 *
 * It will overwrite the --in file passed in the command line args
 */

var colors = require('colors')
const program = require('commander');
const fs = require('fs')
const path = require('path')

program
  .option('-i, --in [data]', 'Filename read in')
  .option('-o, --out [data]', 'Filename write out')
  .option('-t, --testrun', 'Testrun only, do not write to an out file')
  .parse(process.argv);

(!program.out) ? console.log(`No out file specified to write to`.white.bgBlue) : null

let fileContents
let stateCountHash = {}
let cityCountHash = {}

console.log(`Reading in file ${program.in}`.yellow.inverse);
  try {
    fileContents = fs.readFileSync(program.in)
  } catch (e) {
    console.log(`Error reading in file`.red);
    process.exit()
  }

console.log(`Parsing file contents...`.yellow.inverse);
  try {
    fileContents = JSON.parse(fileContents)
  } catch (e) {
    console.error(`Failed to JSON.parse fileContents`,e);
    process.exit()
  }

console.log(`Making statHashes...`.yellow.inverse);
  try {
    fileContents.forEach(obj => {
      let stateKey = obj.location.substr(-2)
      if (!stateCountHash[stateKey]) { stateCountHash[stateKey] = 1 }
      else { stateCountHash[stateKey] = stateCountHash[stateKey] + 1 }

      if (!cityCountHash[obj.location]) { cityCountHash[obj.location] = 1 }
      else { cityCountHash[obj.location] = cityCountHash[obj.location] + 1 }
    })

    // Make hashes into arrays then sort by numbers
    stateCountHash = Object.keys(stateCountHash).map(key => {return key + ': ' + stateCountHash[key] })
    cityCountHash = Object.keys(cityCountHash).map(key => {return key + ': ' + cityCountHash[key] })

    stateCountHash = stateCountHash.sort((a,b) => {
      return parseInt( b.substr(b.indexOf(':') + 1) ) < parseInt( a.substr(a.indexOf(':') + 1) ) ? -1 : 1
    })

    cityCountHash = cityCountHash.sort((a,b) => {
      return parseInt( b.substr(b.indexOf(':') + 1) ) < parseInt( a.substr(a.indexOf(':') + 1) ) ? -1 : 1
    })

  } catch (e) {
    console.error(`Failed to make statHashes & replace`,e);
    process.exit()
  }
  console.log(`Total counts:`.yellow);
  console.log(`   ${JSON.stringify(stateCountHash, null, 2)}`);
  console.log(` - - - - - - - - - - - - - - - -`);
  console.log(`   ${JSON.stringify(cityCountHash, null, 2)}`);

if (program.out) {
  console.log(`Writing filtered array to file ${program.out.blue.inverse}`.yellow.inverse);
    try {
      fs.writeFileSync(program.out, JSON.stringify(Object.assign({},{byState:stateCountHash}, {byCity:cityCountHash})))
    } catch (e) {
      console.error(`Failed to write fileContents to file ${program.out}`);
      console.log(`current fileContents:`,fileContents);
      process.exit()
    }
}
