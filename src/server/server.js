const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const SSH = require("simple-ssh");
const net = require("./net");
const common = require("./common");
const conndata = require("./data/conndata.json");

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


/*    BEGIN ROUTES    */

app.get("/", (req, res) => {
    // res.set("Content-Type", "text/html");
    res.sendFile(path.resolve(__static, "index.html"));
});

app.get("/test", (req, res) => {
    res.send("Test succeeded - app is working properly");
});







async function SendLineInternal(id, line) {
    let res = new Promise(function(resolve, reject) {
        
        connections[id].exec(line, {
            out: (stdout) => {
                // res.set("Content-Type", "text/json");
                // res.json({
                //     output: stdout
                // });
                // resolve("good!");
                if (stdout != "") {
                    resolve(stdout);
                } else {
                    reject("error retrieving stdout for command '" + line + "'");
                }
                // res.status(500).json({ error: "an error occurred" });
            }
        }).start();


        // may be a heavy db call or http request?
         // successfully fill promise
    });

    res.then( (message) => {
        // console.log(message);
        return message;
    }).catch( (message) => {
        // console.log(message);
        return message;
    });
}

async function SendCommand(id, line) {
    var lineRes = await SendLineInternal(id, line);
    return lineRes;
}

app.post("/command", async (req, res, next) => {
    // Get the command from user input on frontend
    const line = req.body.line;
    const address = req.body.address;
    console.log(`server received command "${line}" for address "${address}"`);

    // Send the command to the raspi and get the raspi's output
    var id = parseInt(address[address.length - 1]);
    var response = SendCommand(id, line);
    response.then( (message) => {
        console.log(`message: ${message}`)
        res.set("Content-Type", "text/json");
        res.json({
            output: "stdout"
        });
    });
    // console.log(`response: ${response}`);

    // res.set("Content-Type", "text/json");
    // res.json({
    //     output: "stdout"
    // });

    // var output = net.SendCommand(line, connections[id]);
    // console.log(`output: ${output}`);


});

/*    END ROUTES    */


/*    START SERVER    */

app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});

/*    END SERVER    */