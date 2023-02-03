const axios = require('axios')

const API = axios.create({
  baseURL: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api`,
  validateStatus: function (status) { return status < 500 },
  auth: {
    username: `${process.env.ZENDESK_EMAIL}/token`,
    password: process.env.ZENDESK_API_TOKEN
  }
})

module.exports = API