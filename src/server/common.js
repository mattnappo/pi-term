const NodeRSA = require("node-rsa");
const fs      = require("fs");

function GenerateNewKey() {
    var newKey = new NodeRSA({b: 2048});
    fs.writeFile("key.pem", newKey.exportKey("pkcs8") , "utf-8", (err) => {
        if (err) {
            return console.log(err);
        }
    });
    console.log(newKey.encrypt("pwd here", "base64"));

}

function LoadPassword(raw) {
    var keyData = fs.readFileSync("key.pem", "utf-8").toString();
    const key = new NodeRSA(keyData, "pkcs8-private-pem");
    return key.decrypt(raw, "utf8");
}

module.exports = {
    LoadPassword: LoadPassword,
    GenerateNewKey: GenerateNewKey
};