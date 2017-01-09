/**
 * This module will read a file that contains a JSON array and if will dedupe
 * all duplicate objects.
 *
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
  .parse(process.argv);

let fileContents, newFileArray = []
let hash = {}
let hashKeyValueMap = {}

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

console.log(`Filtering & checking dups on array...`.yellow.inverse);
console.log(`   ${fileContents.length} listings before deduping`);
  try {
    // fileContents = fileContents.map(obj => {
    fileContents.forEach((obj, i) => {
      if (!obj || typeof obj !== 'object') return
      let hashKey = obj.title+obj.location+obj.company
      // hashKey = hashKey.replace(/ +/g, '')

      if (!hash[hashKey]) {
        hash[hashKey] = 1
        hashKeyValueMap[hashKey] = obj
      } else {
        hash[hashKey] = hash[hashKey] + 1
      }

      // return obj
    })

    Object.keys(hash).forEach((hashKey, i) => {
      if (hash[hashKey] < 2) {
        // console.log(`${hash[hashKey]}`)
        newFileArray.push(hashKeyValueMap[hashKey])
      }
    })

  } catch (e) {
    console.error(`Failed to filter & replace`,e);
    process.exit()
  }
console.log(`   ${newFileArray.length} listings after deduping`);

console.log(`Writing deduped array to file ${program.out.blue.inverse}`.yellow.inverse);
  try {
    fs.writeFileSync(program.out, JSON.stringify(newFileArray))
  } catch (e) {
    console.error(`Failed to write newFileArray to file ${program.out}`,e);
    console.log(`current newFileArray:`,newFileArray);
    process.exit()
  }
