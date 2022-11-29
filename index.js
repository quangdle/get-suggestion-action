const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  const repoPath = core.getInput("main_schema_path");
  console.log(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);

  const buffer = fs.readFileSync(repoPath + "/src/MailIntegrationModal.js");
  const fileContent = buffer.toString();

  console.log(fileContent);

  const transformPath = path.resolve(__dirname, "transform.js");

  const result = execSync(
    `jscodeshift -t ${transformPath} ${
      repoPath + "/src/MailIntegrationModal.js"
    }`
  );
  console.log(result);
} catch (error) {
  core.setFailed(error.message);
}
