const execSync = require("child_process").execSync;

// getRepos - Return an array of the host's docker containers' repository names
function getRepos() {
    let command = "docker images --format '{{json .Repository}}'";
    let stdout = execSync(command).toString("utf8");
    // console.log(stdout);
}

// getCreated - Return an array of when the host's docker containers were created
function getCreated() {
    let command = "docker images --format '{{json .Created}}'";
    let stdout = execSync(command).toString("utf8");
    console.log(stdout.replace("\"", ""));
}

function getAllJson() {
    let command = "docker images --format '{{json .}}'";
    let stdout = execSync(command).toString("utf8");
    JSON.stringify(stdout, null, "\t"); // stringify with tabs inserted at each level
    JSON.stringify(stdout, null, 4);    // stringify with 4 spaces at each level
    console.log(stdout);
}

// getRepos();
// getCreated();

getAllJson();