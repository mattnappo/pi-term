const NodeRSA = require("node-rsa");
const exec = require("child_process").exec;
const execSync = require("child_process").execSync;
const fs = require("fs");

const ips = [
    "192.168.1.100",
    "192.168.1.101",
    "192.168.1.102",
    "192.168.1.103"
];

// GenerateNewKey - Generate a new RSA key
function GenerateNewKey() {
    var newKey = new NodeRSA({
        b: 2048
    });
    fs.writeFile("key.pem", newKey.exportKey("pkcs8"), "utf-8", (err) => {
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

// ping - Internal ping func, returns a promise w/ stdout of ping command on an IP
function ping(ip) {
    return new Promise(function (resolve, reject) {
        let command = "ping -c 1 " + ip;
        exec(command, (error, stdout, stderr) => {
            if (error !== null) console.log("exec error: " + error);
            if (stdout != "") {
                let rawTime = stdout.split("time=")[1].split(" ");
                let time = rawTime[0] + " " + rawTime[1].split("\n")[0];
                resolve(time);
            }
            else {
                reject("error (from promise) retrieving stdout");
            }
        });
    });
}

// Ping - Return the ping of a local IP address (in ms)
function Ping(ip) {
    return ping(ip)
    .then(time => {
        return time;
    })
    .catch(error => {
        console.log(`error - ${error}`);
    });
}

/* BEGIN DEPRECATED */

// PingAll - Ping all four of the Raspberry pis and return an object containing the ping promises
async function PingAll() {
    let promises = { };
    for (let i = 0; i < ips.length; i++) {
        promises[ips[i]] = await Ping(ips[i]).then(out, () => {
            return out;
        });
    }
    return promises;
}

/* END DEPRECATED */
// var er = Ping("192.168.1.100");
// console.log(er.then((out) => {
//     return out;
// }));
let ip = "192.168.1.1";
let command = "ping -c 1 " + ip;
let shit = code = execSync(command);
console.log(shit);

let json = JSON.stringify(shit);
console.log(json);

console.log(shit.toString('utf8'));

module.exports = {
    LoadPassword: LoadPassword,
    GenerateNewKey: GenerateNewKey,
    Ping: Ping,
    PingAll: PingAll
};