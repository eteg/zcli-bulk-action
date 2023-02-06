const fs = require('fs');
const FormData = require('form-data');
const API = require('./api.js')

async function uploadPackage(packagePath) {
  const packageForm = new FormData()
  const packageBuffer = fs.createReadStream(packagePath)

  packageForm.append('uploaded_data', packageBuffer)

  const response = await API(`/v2/apps/uploads`, 
  {
    data: packageForm,
    method: 'POST',
  })

  if (response.status !== 201) {
    throw new Error('Package upload failed')
  }

  return response.data.id
}

async function installPackage(upload_id) {
  const response = await API(
    `/v2/apps/${process.env.ZENDESK_APP_ID}`, 
    {
      data: JSON.stringify( { upload_id }),
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
  
  return response.data.job_id
}

module.exports = {
  uploadPackage,
  installPackage
}