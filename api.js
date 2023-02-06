const axios = require('axios')

const authorization =`Basic ${Buffer.from(`${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`).toString('base64')}`

const API = (url, options) => {
  if (options.headers) {
    options.headers = { Authorization: authorization, ...options.headers }
  } else {
    options.headers = { Authorization: authorization }
  }

  return axios.request({
    baseURL: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api`,
    url: url,
    validateStatus: function (status) { return status < 500 },
    ...options
  })
}

module.exports = API