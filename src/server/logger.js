var settings = {
    enabled: false
};

function enableLogging() {
    settings.enabled = true;
}

function log(s) {
    if (settings.enabled) {
        console.log(s);
    }
}

module.exports = {
    enableLogging: enableLogging,
    log: log
}