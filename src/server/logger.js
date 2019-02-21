const crypto = require("./crypto");
const path   = require("path");
const fs     = require("fs");

// settings - Configure the logger's settings / defaults
var settings = {
    enabled: false,
    raw: false,
    location: "./logs"
};

// A string containing all of the logs
var currentLog = "";

// The name of the log file to export (random)
var logName = crypto.Hash(Date().toString()).substring(1, 9);

// time - Date() wrapper to get the current time
function time() {
    return " @ " + Date().toString();
}

// enableLogging - Enable the logger's printing functionality
function enableLogging() {
    settings.enabled = true;
}

// raw - Print the logs with timestamps and without formatting to the screen
function raw() {
    settings.raw = true;
}

// log - Print out the log to the screen and save to the current, overall log
function log(s) {
    if (s != "") {
        currentLog = currentLog + s + time() + "\n";
        if (settings.enabled) {
            if (settings.raw) {
                console.log(s + time());
            } else {
                s = "===== " + s + " =====";
                console.log(s);
            }
        }
    }
}

// exportLog - Write the current log to a file
function exportLog() {
    if (!fs.existsSync(settings.location)) fs.mkdirSync(settings.location);
    let loc = path.resolve(settings.location, logName + ".log");
    fs.writeFileSync(loc, currentLog, {
        mode: 0o755
    });
}

// Export the necessary methods
module.exports = {
    enableLogging: enableLogging,
    raw: raw,
    log: log,
    exportLog: exportLog
}

// The rest of the code makes sure that the log gets exported when the program exits
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