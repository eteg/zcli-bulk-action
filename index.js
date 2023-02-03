const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const package = require('./package');
const update = require('./update');
const job = require('./job');
const utils = require('./utils');

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
    const customers = process.env.CUSTOMERS

    console.log(customers)

    if (environment !== 'production' && environment !== 'staging') {
      throw new Error('Environment input must be provided (production or staging).');
    }

    await exec.exec(`echo 💡 Job started at ${dateTime} - Environment: ${environment}`);
    await exec.exec(`echo 🖥️ Job was automatically triggered by ${eventName} event`);
    await exec.exec(`echo 🔎 The name of your branch is ${ref} and your repository is ${repository.name}.`);
    
    await exec.exec(`echo 🐧 Installing dependencies...`);
    await exec.exec('yarn install');

    await exec.exec(`echo 🐧 Packaging, Validating and Updating...`);
    for (const customer of customers) {
      await exec.exec(`🐧 Creating .env and Building...`);
      utils.objectToEnv(customer.environment[environment])
      await exec.exec(`yarn build`);
      
      await exec.exec(`🐧 Packaging, Validating and Updating...`);
      const packagePath = await package.createPackage(path)
      await package.validatePackage(packagePath)
      const uploadId = await update.uploadPackage(packagePath)
      const jobId = await update.installPackage(uploadId)
      const { app_id } = await job.getJobStatuses(jobId)
      
      await exec.exec(`🐧 Package path: ${packagePath}`);
      await exec.exec(`🐧 Upload ID: ${uploadId}`);
      await exec.exec(`🐧 Job ID: ${jobId}`);
      await exec.exec(`🐧 Job Status: Completed for app_id: ${app_id}`);
      await exec.exec(`🐧 Customer: ${customer.name} has been updated.`);
    }

    await exec.exec(`echo 🚀 Job has been finished`);
  } catch (error) {
    core.setFailed(error.message);
  }
} 

run()