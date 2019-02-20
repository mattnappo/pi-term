const express    = require("express");
const path       = require("path");
const bodyParser = require("body-parser");
const SSH        = require("simple-ssh");

const crypto   = require("./crypto");
const status   = require("./status");
const conndata = require("./data/conndata.json");

/*    BEGIN SETUP    */

var app = express();
const port = 3000;
const __static = "src/static"
var authenticated = false;
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
            pass: crypto.LoadPassword(conndata[conn].pass)
        });
        ssh.exec("hostname -I", {
            out: (stdout) => {
                // console.log(`SSH initialized for ${stdout}`);
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
                } else {
                    reject("error retrieving stdout for command '" + line + "'");
                }
            }
        }).start()
    });
}

// GetUptimes - Return a promise of an object of the uptimes for each one of the raspis
async function GetUptimes() {
    let uptimes = [];
    for (let i = 0; i < 4; i++) {
        let uptime = await SendCommand("uptime", i);
        uptimes.push(uptime);
    }
    const data = {
        "uptime0": uptimes[0],
        "uptime1": uptimes[1],
        "uptime2": uptimes[2],
        "uptime3": uptimes[3]
    };
    return data;
}

/*    END NET    */


/*    BEGIN ROUTES    */

app.get("/", (req, res) => {
    res.set("Content-Type", "text/html");
    res.sendFile(path.resolve(__static, "login.html"));
});

app.post("/login", (req, res, next) => {
    var user = req.body.username;
    var pass = req.body.password;
    console.log(`username: ${user}\npassword: ${pass}`);

    res.set("Content-Type", "text/html");
    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    res.set("Content-Type", "text/html");
    res.sendFile(path.resolve(__static, "dash.MOCKUP.html"));
});

app.post("/command", (req, res, next) => {
    // Get the command and IP from user input on frontend
    const line = req.body.line;
    const address = req.body.address;
    var id = parseInt(address[address.length - 1]);
    console.log(`server received command "${line}" for address "${address}" (id: ${id})`);

    SendCommand(line, id)
        .then(stdout => {
            // console.log(String.Raw`stdout`);
            console.log(String.raw `/\//`.match(stdout));
            res.set("Content-Type", "text/json");
            res.json({
                output: stdout
            });
        })
        .catch(error => {
            console.log(`error - ${error}`);
        });

});

app.get("/test", (req, res) => {
    res.send("Tests succeeded - app is working properly");
});

// ----- START TERMINAL ROUTES -----

var currentIp = "";
app.post("/terminal", (req, res) => {
    console.log(`new current ip: ${req.body.ip}`);
    currentIp = req.body.ip;
    res.sendFile(path.resolve(__static, "terminal.html"));
    // res.json({ ip: "192.168.1.100" }); // Not needed (I don't think)
});

// This is a bad solution. It is more like a workaround.
// I'll fix this later
app.post("/getTerminalIp", (req, res) => {
    res.json({
        ip: currentIp
    });
});

// ----- END TERMINAL ROUTES -----


// ----- START STATUS ROUTES -----

app.get("/statusData", (req, res) => {

    GetUptimes().then(uptimes => {
        var pings = status.PingAll();
        const data = {
            "pings": pings,
            "uptimes": uptimes
        };
        res.send(JSON.stringify(data));
    });
});


app.get("/uptimeData", (req, res) => {
    
});

// ----- END STATUS ROUTES -----

/*    END ROUTES    */


/*    START SERVER    */

app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});

/*    END SERVER    */