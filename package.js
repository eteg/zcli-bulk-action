const path = require('path')
//const data = require('./test.json')
const fs = require('fs')
const archiver = require('archiver')

function log(message) {
  return console.log(`[LOG]: ${message}`)
}

async function createPackage(srcRelativePath, version) {
  const srcAbsolutePath = path.resolve(srcRelativePath)

  if (!fs.existsSync(path.join(srcAbsolutePath, 'manifest.json'))) {
    throw new Error('manifest.json not found')
  }

  if (!fs.existsSync(path.join(srcAbsolutePath, 'zcli.apps.config.json'))) {
    throw new Error('zcli.apps.config.json not found')
  }

  const packageName = `${new Date().toISOString().replace(/[^0-9]/g, '')}-v${version}`
  const packagePath = `${srcAbsolutePath}/tmp/${packageName}.zip` 

  log(packageName)
  log(packagePath)

  if (!fs.existsSync(path.join(srcAbsolutePath, 'tmp'))) {
    fs.mkdirSync(path.join(srcAbsolutePath, 'tmp'))
  }

  const packageStream = fs.createWriteStream(packagePath)
  const packageZip = archiver('zip')

  packageZip.pipe(packageStream)

  await packageZip.finalize()

  if (!fs.existsSync(packagePath)) {
    throw new Error(`Failed to create package at ${packagePath}`)
  }

  return packagePath
}

/* async function validatePackage() {
  
}
 */
//createPackage('dist', '1.0.0')

module.exports = {
  createPackage,
  //validatePackage
}


