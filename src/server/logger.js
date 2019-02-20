const crypto = require("./crypto");
const path = require("path");
const fs = require("fs");

var settings = {
    enabled: false,
    showTimestamps: false,
    location: "./logs"
};

var currentLog = [ ];
var logName = crypto.Hash(Date().toString()).substring(1, 9);

function time() {
    return " @ " + Date().toString();
}

function enableLogging() {
    settings.enabled = true;
}

function showTimestamps() {
    settings.showTimestamps = true;
}

function log(s) {
    if (s != "") {
        currentLog = currentLog + s + time() + "\n";
        s = "===== " + s + " =====";
        if (settings.enabled) {
            if (settings.showTimestamps) {
                console.log(s + time());
            }
            else {
                console.log(s);
            }
        }
    }
}

function exportLog() {
    if (!fs.existsSync(settings.location)) fs.mkdirSync(settings.location);
    let loc = path.resolve(settings.location, logName + ".log");
    fs.writeFileSync(loc, currentLog, { mode: 0o755 });
}

module.exports = {
    enableLogging: enableLogging,
    showTimestamps: showTimestamps,
    log: log,
    exportLog: exportLog
}

process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup) exportLog();
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on("exit", exitHandler.bind(null, {
    cleanup: true
}));

// catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {
    exit: true
}));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, {
    exit: true
}));
process.on("SIGUSR2", exitHandler.bind(null, {
    exit: true
}));

// catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, {
    exit: true
}));