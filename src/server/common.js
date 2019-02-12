const NodeRSA = require("node-rsa");
const exec = require("child_process").exec;
const fs = require("fs");

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

// Ping - Return the ping of a local IP address (in ms)
function Ping(ip) {
    let command = "ping -c 1 " + ip;
    exec(command, (error, stdout, stderr) => {
        if (error !== null) console.log("exec error: " + error);
        // console.log(stdout);
        let rawTime = stdout.split("time=")[1].split(" ");
        let time = rawTime[0] + " " + rawTime[1].split('\n')[0];
        console.log(time);
        return stdout;
    });

}

// Ping("192.168.1.100");
Ping("192.168.1.101");
Ping("192.168.1.102");
Ping("192.168.1.103");


module.exports = {
    LoadPassword: LoadPassword,
    GenerateNewKey: GenerateNewKey,
    Ping: Ping
};