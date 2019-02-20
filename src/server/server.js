const express    = require("express");
const path       = require("path");
const bodyParser = require("body-parser");
const SSH        = require("simple-ssh");

const crypto   = require("./crypto");
const status   = require("./status");
const logger   = require("./logger");
const conndata = require("./data/conndata.json");

// Enable logging?
logger.enableLogging();
// Show timestamps?
logger.raw();

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
logger.log(`SERVER: Setup complete`);

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
                let trimmed = stdout.trim();
                logger.log(`SSH: Initialized ${trimmed}`);
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
    logger.log(`GET: /`);
    res.set("Content-Type", "text/html");
    res.sendFile(path.resolve(__static, "login.html"));
    logger.log(`SENT: /`);
});

app.post("/login", (req, res, next) => {
    logger.log(`POST: login`);
    var user = req.body.username;
    var pass = req.body.password;
    console.log(`username: ${user}\npassword: ${pass}`);

    res.set("Content-Type", "text/html");
    logger.log(`REDIRECT: login -> dashboard`);
    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    logger.log(`GET: dashboard`);
    res.set("Content-Type", "text/html");
    res.sendFile(path.resolve(__static, "dash.MOCKUP.html"));
    logger.log(`SENT: dashboard`);
});

app.post("/command", (req, res, next) => {
    logger.log(`POST: command`);
    // Get the command and IP from user input on frontend
    const line = req.body.line;
    const address = req.body.address;
    var id = parseInt(address[address.length - 1]);
    logger.log(`COMMAND: Received command "${line}" for address "${address}" (id: ${id})`);

    SendCommand(line, id)
        .then(stdout => {
            // console.log(String.Raw`stdout`);
            console.log(String.raw `/\//`.match(stdout));
            res.set("Content-Type", "text/json");
            res.json({
                output: stdout
            });
            logger.log(`SENT: command`);
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
    logger.log(`POST: terminal`);
    currentIp = req.body.ip;
    res.sendFile(path.resolve(__static, "terminal.html"));
    logger.log(`SENT: terminal`);
});

// This is a bad solution. It is more like a workaround.
// I'll fix this later
app.post("/getTerminalIp", (req, res) => {
    logger.log(`POST: getTerminalIp`);
    res.json({
        ip: currentIp
    });
    logger.log(`SENT: getTerminalIp`);
});

// ----- END TERMINAL ROUTES -----


// ----- START STATUS ROUTES -----

app.get("/statusData", (req, res) => {
    logger.log(`GET: statusData`);
    GetUptimes().then(uptimes => {
        var pings = status.PingAll();
        const data = {
            "pings": pings,
            "uptimes": uptimes
        };
        res.send(JSON.stringify(data));
        logger.log(`SENT: statusData`);
    });
});

// ----- END STATUS ROUTES -----

/*    END ROUTES    */


/*    START SERVER    */

app.listen(port, () => {
    logger.log(`SERVER: Initiated on port ${port}`);
});

/*    END SERVER    */


/*    DON'T CLOSE APP    */