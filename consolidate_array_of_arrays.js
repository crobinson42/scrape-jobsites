/**
 * This script will take in a json file and consolidate the data structure to
 * a more simple array of objects.
 */

var colors = require('colors')
const program = require('commander');
const fs = require('fs')
const path = require('path')

program
  .option('-i, --in [data]', 'Filename read in')
  .option('-o, --out [data]', 'Filename to write to')
  .parse(process.argv);

let fileContents

console.log(`Reading in file ${program.in}`.invert);
  try {
    fileContents = fs.readFileSync(program.in)
  } catch (e) {
    console.log(`Error reading in file`.red);
  }

console.log(`Parsing file contents...`.invert);
  try {
    fileContents = JSON.parse(fileContents)
  } catch (e) {
    console.error(`Failed to JSON.parse fileContents`,e);
  }

console.log(`Writing consolidated array to file ${program.out.blue}`.invert);
  try {
    fs.writeFileSync(program.out, JSON.stringify(consolidationArrayFromFiles))
  } catch (e) {
    console.error(`Failed to write consolidationArrayFromFiles to file ${program.out}`);
    console.log(`current consolidationArrayFromFiles:`,consolidationArrayFromFiles);
  }
