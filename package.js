const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const FormData = require('form-data')

const API = require('./api.js')

async function createPackage(srcRelativePath) {
  const srcAbsolutePath = path.resolve(srcRelativePath)

  if (!fs.existsSync(path.join(srcAbsolutePath, 'manifest.json'))) {
    throw new Error('manifest.json not found')
  }

  if (!fs.existsSync(path.join(srcAbsolutePath, 'zcli.apps.config.json'))) {
    throw new Error('zcli.apps.config.json not found')
  }

  const manifest = fs.readFileSync(path.join(srcAbsolutePath, 'manifest.json'), 'utf8')
  const { version } = JSON.parse(manifest)

  const packageName = `${new Date().toISOString().replace(/[^0-9]/g, '')}-v${version}`
  const packagePath = `${srcAbsolutePath}/tmp/${packageName}.zip` 
  
  if (!fs.existsSync(path.join(srcAbsolutePath, 'tmp'))) {
    fs.mkdirSync(path.join(srcAbsolutePath, 'tmp'))
  }

  const packageOutput = fs.createWriteStream(packagePath);
  const packageArchive = archiver('zip')

  packageArchive.pipe(packageOutput)

  packageArchive.glob('**', {
    cwd: srcAbsolutePath,
    ignore: ['tmp/**']
  })

  await packageArchive.finalize()

  if (!fs.existsSync(packagePath)) {
    throw new Error(`Failed to create package at ${packagePath}`)
  }

  return packagePath
}

// Zendesk API route not working as expected
async function validatePackage(packagePath) {
  const formData = new FormData()
  formData.append('file', fs.createReadStream(packagePath))
  const response = await API.post('/v2/apps/validate', { formData })
  return response.data
}

module.exports = {
  createPackage,
  validatePackage
}