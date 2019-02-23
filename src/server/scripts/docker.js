const execSync = require("child_process").execSync;

// sendCommandAndParse - Exec a command on the host and parse it accordingly
function sendCommandAndParse(command) {
    let stdout = execSync(command).toString("utf8");
    let stripped = stdout.replace(/"/g, "");
    let parsed = stripped.split("\n");
    return parsed;
}

const data = {
    repositories: sendCommandAndParse("docker images --format '{{json .Repository}}'"),
    created: sendCommandAndParse("docker images --format '{{json .CreatedSince}}'")
};

console.log(data);