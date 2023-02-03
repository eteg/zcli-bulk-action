const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const package = require('./package');
const update = require('./update');
const job = require('./job');

async function run() {
  try {
    const dateTime = (new Date()).toLocaleString('pt-BR');

    const { 
      ref,
      eventName
    } = github.context;

    const {
      repository
    } = github.context.payload;

    const environment = core.getInput('ENVIRONMENT');
    const path = core.getInput('PATH');
    const customers = core.getInput('CUSTOMERS')

    if (environment !== 'production' && environment !== 'staging') {
      throw new Error('Environment input must be provided (production or staging).');
    }

    await exec.exec(`echo 💡 Job started at ${dateTime} - Environment: ${environment}`);
    await exec.exec(`echo 🖥️ Job was automatically triggered by ${eventName} event`);
    await exec.exec(`echo 🔎 The name of your branch is ${ref} and your repository is ${repository.name}.`);
    
    await exec.exec(`echo 🐧 Installing dependencies...`);
    await exec.exec('yarn install');

    await exec.exec(`echo 🐧 Creating .env and Building...`);
    // Loop through customers instances and create .env file before update
    await exec.exec(`echo ${process.env} >>> .env`);
    await exec.exec(`yarn build`);

    await exec.exec(`echo 🐧 Packaging, Validating and Updating...`);

    await exec.exec(`echo 🚀 Job has been finished`);
  } catch (error) {
    core.setFailed(error.message);
  }
} 

//run();

async function run2() {
  const packagePath = await package.createPackage('dist2')
  //await package.validatePackage(packagePath)
  const uploadId = await update.uploadPackage(packagePath)
  console.log('upload_id', uploadId)
  const jobId = await update.installPackage(uploadId)
  console.log('job_id', jobId)
  const jobStatus = await job.getJobStatuses(jobId).catch(console.log)
  console.log(jobStatus)
}

run2()