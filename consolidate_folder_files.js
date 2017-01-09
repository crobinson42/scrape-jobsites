/**
 * This script will take in a directory and a file name.
 * It will read all .json files and consolidate them into the param filename.
 */

var colors = require('colors')
const program = require('commander');
const fs = require('fs')
const path = require('path')

program
  .option('-d, --dir [data]', 'Directory where files live')
  .option('-f, --filename [data]', 'Filename to consolidate all .json to')
  .parse(process.argv);

let consolidationArrayFromFiles = []

fs.readdir(program.dir, (err, files) => {
  if (err && err.code === 'ENOENT') {
    console.error(`Directory does not exist`);
    return process.exit()
  }

  // get only json files
  files = files.filter(f => /.json$/.test(f))

  files.forEach((fileName, i) => {
    console.log(`Reading file ${fileName}`.cyan);
    fileName = path.join(program.dir, fileName)

    let _fileContents = fs.readFileSync(fileName)

    try {
      consolidationArrayFromFiles = consolidationArrayFromFiles.concat(JSON.parse(_fileContents))
    } catch (e) {
      console.error(`Failed to concat/JSON.parse from ${fileName}`,e);
      console.log(`current consolidationArrayFromFiles:`,consolidationArrayFromFiles);
    }
  })

  console.log(`Writing consolidated array to file ${program.filename.blue}`.inverse);
  // write to a single file
  try {
    fs.writeFileSync(program.filename, JSON.stringify(consolidationArrayFromFiles))
  } catch (e) {
    console.error(`Failed to write consolidationArrayFromFiles to file ${program.filename}`);
    console.log(`current consolidationArrayFromFiles:`,consolidationArrayFromFiles);
  }
})
