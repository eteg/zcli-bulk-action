const process = require('process');
const cp = require('child_process');
const path = require('path');

test('test runs', () => {
  const ip = path.join(__dirname, 'index.js');
  const result = cp.exec(`node ${ip}`, {env: process.env}).toString();
  console.log(result);
})