const express = require("express");
const bodyParser = require("body-parser");

var app = express();
const port = 9080;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/test", (req, res) => {
    res.send("successsss!");
});

app.post("/txn", (req, res) => {
    var sender = req.body.account;
    var recipient = req.body.account1;
    var amount = req.body.amount;
    var nonce = req.body.nonce;
    var payload = req.body.payload;

    console.log(`sender: ${sender}\nrecipient: ${recipient}\namount: ${amount}\nnonce: ${nonce}\payload: ${payload}`);
    res.send("you win");
});

app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});