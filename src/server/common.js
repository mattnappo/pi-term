const execSync = require("child_process").execSync;

// LocalCommand - Execute a command locally and return the output
function LocalCommand(command) {
    return execSync(command).toString("utf8");
}

module.exports = {
    LocalCommand: LocalCommand
}