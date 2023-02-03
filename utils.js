let fs = require('fs');

function objectToEnv(object) {
  const data = Object.entries(object)
  .map(([key, value]) => `ZENDESK_${key.toLocaleUpperCase()}=${value}`)
  .join("\n");

  fs.writeFileSync(".env", data);
}


module.exports =  {
  objectToEnv
}