const express    = require("express");
const path       = require("path");
const bodyParser = require("body-parser");
const SSH        = require("simple-ssh");

const common     = require("./common");
const conndata   = require("./data/conndata.json");

/*    BEGIN SETUP    */

var app = express();
const port = 3030;
const __static = "src/static"
const options = {
    dotfiles: "ignore",
    extensions: ["html", "css", "js"],
    setHeaders: (res, path, stat) => {
        res.set("x-timestamp", Date.now())
    }
};
app.use(express.static(__static, options));
app.use(bodyParser.urlencoded({
    extended: true
}));

/*    END SETUP    */


/*    START SSH    */

var connections = [];
for (var conn in conndata) {
    if (conndata.hasOwnProperty(conn)) {
        var ssh = new SSH({
            host: conndata[conn].host,
            user: conndata[conn].user,
            pass: common.LoadPassword(conndata[conn].pass)
        });
        ssh.exec("hostname -I", {
            out: (stdout) => {
                console.log(`SSH initialized for ${stdout}`);
            }
        }).start();
        connections.push(ssh);
    }
}

/*    END SSH    */


/*    BEGIN NET    */

// SendCommand - Send a command to a raspi
function SendCommand(command, id) {
    return new Promise(function (resolve, reject) {
        connections[id].exec(command, {
            out: (stdout) => {
                if (stdout != "") {
                    resolve(stdout);
                }
                else {
                    reject("error retrieving stdout for command '" + line + "'");
                }
            }
        }).start()
    });
}

/*    END NET    */


/*    BEGIN ROUTES    */

app.get("/", (req, res) => {
    res.set("Content-Type", "text/html");
    res.sendFile(path.resolve(__static, "index.html"));
});

app.get("/test", (req, res) => {
    res.send("Test succeeded - app is working properly");
});

app.post("/command", async (req, res, next) => {
    // Get the command and IP from user input on frontend
    const line = req.body.line;
    const address = req.body.address;
    var id = parseInt(address[address.length - 1]);    
    console.log(`server received command "${line}" for address "${address}"`);

    SendCommand(line, id)
    .then(stdout => {
        res.set("Content-Type", "text/json");
        res.json({
            output: stdout
        });
    })
    .catch(error => {
        console.log(`error - ${error}`);
    });

});

/*    END ROUTES    */


/*    START SERVER    */

app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});

/*    END SERVER    */