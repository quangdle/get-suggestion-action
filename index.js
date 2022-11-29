const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  const repoPath = core.getInput("main_schema_path");
  const changedFiles = core.getInput("changed-files");

  console.log(`Hello ${nameToGreet}!`);

  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);

  console.log("files changed", changedFiles);

  const transformPath = path.resolve(__dirname, "transform.js");

  const result = execSync(
    `jscodeshift -t ${transformPath} ${
      repoPath + "/src/MailIntegrationModal.js"
    }`
  );
  console.log(result.toString());
} catch (error) {
  core.setFailed(error.message);
}
