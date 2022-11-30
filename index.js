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
  const myToken = core.getInput("my-token");
  const prNumber = core.getInput("pr-number");
  const octokit = github.getOctokit(myToken);
  const commit = github.context.sha;
  console.log(`Hello ${nameToGreet}!`);

  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);

  console.log("commit", github.context.sha);

  const transformPath = path.resolve(__dirname, "transform.js");

  (changedFiles || []).split(" ").forEach((item) => {
    const extension = item?.split(".")?.[1];
    if (extension === "js") {
      const result = execSync(`jscodeshift -t ${transformPath} ${item}`);

      result
        .toString()
        .split("\n")
        .forEach((line) => {
          console.log(line);
          if (line.startsWith(" REP")) {
            const [_, _1, relativePath, lineOfCode, value] = line.split(" ");
            octokit.rest.pulls.createReviewComment({
              owner: "quangdle",
              repo: "workflow-testing",
              pull_number: prNumber,
              body: `Use palette color ${value}`,
              commit_id: commit,
              path: relativePath,
              line: Number(lineOfCode),
            });

            console.log({
              owner: "quangdle",
              repo: "workflow-testing",
              pull_number: prNumber,
              body: `Use palette color ${value}`,
              commit_id: commit,
              path: relativePath,
              line: lineOfCode,
            });
          }
        });
    }
  });
} catch (error) {
  core.setFailed(error.message);
}
