/**
 * Counts array length
 */

var colors = require('colors')
const program = require('commander');
const fs = require('fs')
const path = require('path')

program
  .option('-i, --in [data]', 'Filename read in')
  .parse(process.argv);

let fileContents

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
    console.log(`${fileContents.length}`);
  } catch (e) {
    console.error(`Failed to JSON.parse fileContents`,e);
    process.exit()
  }
