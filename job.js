const API = require('./api.js')

async function getJobStatuses(job_id){
  return new Promise((resolve, reject) => {
    const delay = setInterval(async () => {
      const response = await API(`/v2/apps/job_statuses/${job_id}`,
      {
        method: 'GET',
      })
      
      const { status, message, app_id } = response.data;

      console.log(`🐧 Job Status: ${status}. Message: ${message}`)
      
      if (status === 'completed') {
        clearInterval(delay);
        resolve({status, message, app_id })
      } else if (status === 'failed') {
        clearInterval(delay)
        reject(message)
      }
      
    }, 1000);
  })
 
}

module.exports = {
  getJobStatuses
}