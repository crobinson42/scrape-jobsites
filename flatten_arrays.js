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

let fileContents, flattenedArray = []

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

console.log(`Flattening arrays...`.yellow.inverse);
  try {
    fileContents.forEach(obj => {
      if (obj && obj.data && Array.isArray(obj.data)) {
        flattenedArray = flattenedArray.concat(obj.data)
      } else {
        console.log(`Obj.data is not an array...exiting`.red, obj);
        process.exit()
      }
    })
  } catch (e) {
    console.error(`Failed to flatten`,e);
    process.exit()
  }

console.log(`Writing consolidated array to file ${program.out.blue}`.yellow.inverse);
  try {
    fs.writeFileSync(program.out, JSON.stringify(flattenedArray))
  } catch (e) {
    console.error(`Failed to write flattenedArray to file ${program.out}`);
    console.log(`current flattenedArray:`,flattenedArray);
    process.exit()
  }
