// Imports
const execSync = require("child_process").execSync;
const fs = require("fs");

// sendCommandAndParse - Exec a command on the host and parse it accordingly
function sendCommandAndParse(command) {
    let stdout = execSync(command).toString("utf8");
    let stripped = stdout.replace(/"/g, "");
    let parsed = stripped.split("\n");
    return parsed;
}

// The object containing the host's docker image data
const data = {
    repositories: sendCommandAndParse("docker images --format '{{json .Repository}}'"),
    created: sendCommandAndParse("docker images --format '{{json .CreatedSince}}'")
};

// Write to file
fs.writeFile("dockerpull.txt", JSON.stringify(data), function(err, data) {
    if (err) console.log(err);
});