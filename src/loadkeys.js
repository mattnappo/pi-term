const NodeRSA = require("node-rsa");
const fs = require("fs");

// const key = new NodeRSA({b: 2048});
var keyData = fs.readFileSync("../key.pem", "utf-8").toString();

const key = new NodeRSA(String(keyData), "pkcs1-private-pem");
// key.importKey(keyData, "pkcs1");

const text = "eatsleepoverclock";

const encrypted = key.encrypt(text, "base64");
console.log("encrypted: ", encrypted);

const decrypted = key.decrypt(encrypted, "utf8");
console.log("decrypted: ", decrypted);

// var util = require('util');
// fs.writeFile("key.json", util.inspect(key), "utf-8", function(err) {
//     if (err) {
//         return console.log(err);
//     }
// });
