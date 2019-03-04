const express = require("express");
const bodyParser = require("body-parser");

var app = express();
const port = 9080;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    console.log("--- GET: /test ---");

    console.log(`user queried ${req.query.msg}`);

    res.send("you said " + req.query.msg);
});

app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});