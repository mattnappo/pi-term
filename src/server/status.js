const execSync = require("child_process").execSync;

const ips = [
    // "192.168.1.100", // Offline right now
    "192.168.1.101",
    "192.168.1.102",
    "192.168.1.103"
];

// Ping - Return the ping of a local IP address (in ms)
function Ping(ip) {
    let command = "ping -c 1 " + ip;
    let stdout = execSync(command).toString("utf8");
    let rawTime = stdout.split("time=")[1].split(" ");
    let time = rawTime[0] + " " + rawTime[1].split("\n")[0];
    return time;
}

// PingAll - Ping all four of the Raspberry pis and return an object containing the ping promises
function PingAll() {
    let times = { };
    for (let i = 0; i < ips.length; i++) {
        times[ips[i]] = Ping(ips[i]);
    }
    return times;
}

module.exports = {
    Ping: Ping,
    PingAll: PingAll
};