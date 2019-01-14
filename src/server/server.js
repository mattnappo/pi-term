const express    = require("express");
const path       = require("path");
const bodyParser = require("body-parser");
const SSH        = require("simple-ssh");
const net        = require("./net");
const common     = require("./common");
const conndata   = require("./data/conndata.json");

/*    BEGIN SETUP    */

var app = express();
const port = 3030;
const __static = "src/static"
const options = {
    dotfiles: "ignore",
    extensions: ["html", "css", "js"],
    setHeaders: function (res, path, stat) {
        res.set("x-timestamp", Date.now())
    }
};
app.use(express.static(__static, options));
app.use(bodyParser.urlencoded({
    extended: true
}));

/*    END SETUP    */


/*    START SSH    */

var connections = { };
// console.log(conndata);
for (var conn in conndata) {
    // console.log();
    if (conndata.hasOwnProperty(conn)) {
        var ssh = new SSH({
            host: conndata[conn].host,
            user: conndata[conn].user,
            pass: common.LoadPassword(conndata[conn].pass)
        });
        connections[conndata[conn].host] = ssh;
    }
}
 


/*    END SSH    */


/*    BEGIN ROUTES    */

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__static, "index.html"));
});

app.get("/test", (req, res) => {
    res.send("Test succeeded - app is working properly");
});

app.post("/command", (req, res, next) => {
    const line = req.body.line;
    const address = req.body.address;
    console.log("server recieved: '" + line + "'");
    net.sendCommand(line, connections[address]);
});

/*    END ROUTES    */


/*    START SERVER    */

app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});

/*    END SERVER    */