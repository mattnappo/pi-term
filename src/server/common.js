const NodeRSA = require("node-rsa");
const exec = require("child_process").exec;
const execSync = require("child_process").execSync;
const fs = require("fs");

const ips = [
    // "192.168.1.100", // Offline right now
    "192.168.1.101",
    "192.168.1.102",
    "192.168.1.103"
];

// GenerateNewKey - Generate a new RSA key
function GenerateNewKey() {
    var newKey = new NodeRSA({
        b: 2048
    });
    // In production, rename this as key.pem
    // I only named it new_key to prevent myself from accidentally writing over MY key...
    fs.writeFile("new_key.pem", newKey.exportKey("pkcs8"), "utf-8", (err) => {
        if (err) {
            return console.log(err);
        }
    });
    console.log(newKey.encrypt("pwd here", "base64"));
}

// LoadPassword - Return the unencrypted data of a password from the password file
function LoadPassword(raw) {
    var keyData = fs.readFileSync("key.pem", "utf-8").toString();
    const key = new NodeRSA(keyData, "pkcs8-private-pem");
    return key.decrypt(raw, "utf8");
}

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
    LoadPassword: LoadPassword,
    GenerateNewKey: GenerateNewKey,
    Ping: Ping,
    PingAll: PingAll
};