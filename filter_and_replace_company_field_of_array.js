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

// testrun display
  (program.testrun) ? console.log(`Test run... not writing to out file`.white.bgBlue) : null


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
  } catch (e) {
    console.error(`Failed to JSON.parse fileContents`,e);
    process.exit()
  }

console.log(`Filtering & performing regex on array...`.yellow.inverse);
  try {
    fileContents = fileContents.map(obj => {
      if (!obj) {
        console.log(`${obj}`)
        obj = {}
      }

      if (obj.company) {
        obj.company = obj.company.replace(/\n/g,'')
        obj.company = obj.company.replace(/^ +/g,'')
      }

      if (obj.location) {
        let regexMatch = /, [A-Z]{2}(.*)/.exec(obj.location)

        regexMatch = regexMatch && regexMatch[1] ? regexMatch[1] : null

        if (regexMatch) {
          obj.location = obj.location.replace(regexMatch, '')
        }
      }

      return obj
    })
  } catch (e) {
    console.error(`Failed to filter & replace`,e);
    process.exit()
  }

if (program.testrun) {
  console.log(`Test run... not writing to out file`.white.bgBlue);
  process.exit()
}

console.log(`Writing filtered array to file ${program.out.blue.inverse}`.yellow.inverse);
  try {
    fs.writeFileSync(program.out, JSON.stringify(fileContents))
  } catch (e) {
    console.error(`Failed to write fileContents to file ${program.out}`);
    console.log(`current fileContents:`,fileContents);
    process.exit()
  }
