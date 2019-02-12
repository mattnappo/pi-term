const NodeRSA = require("node-rsa");
const fs = require("fs");

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

module.exports = {
    LoadPassword: LoadPassword,
    GenerateNewKey: GenerateNewKey
};