/**
 * This script will take in a directory and a file name.
 * It will read all .json files and consolidate them into the param filename.
 */

const program = require('commander');
const fs = require('fs')
const path = require('path')

program
  .option('-d, --dir [data]', 'Directory where files live')
  .option('-f, --filename [data]', 'Filename to consolidate all .json to')
  .parse(process.argv);

const consolidationArrayFromFiles = []

fs.readdir(program.dir, (err, files) => {
  if (err && err.code === 'ENOENT') {
    console.error(`Directory does not exist`);
    return process.exit()
  }

  // get only json files
  files = files.filter(f => /.json$/.test(f))

  files.forEach(fileName => {
    fileName = path.join(program.dir, fileName)

    const _fileContents = fs.readFileSync(fileName)

    try {
      consolidationArrayFromFiles = consolidationArrayFromFiles.concat(JSON.parse(_fileContents))
    } catch (e) {
      console.error(`Failed to concat/JSON.parse from ${fileName}`);
      console.log(`current consolidationArrayFromFiles:`,consolidationArrayFromFiles);
    }
  })

  // write to a single file
  try {
    fs.writeFile(program.filename, JSON.stringify(consolidationArrayFromFiles))
  } catch (e) {
    console.error(`Failed to write consolidationArrayFromFiles to file ${program.filename}`);
    console.log(`current consolidationArrayFromFiles:`,consolidationArrayFromFiles);
  }
})
