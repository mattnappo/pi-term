const express    = require("express");
const path       = require("path");
const bodyParser = require("body-parser");
const net        = require("./net");

// Setup the app
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

/*    BEGIN ROUTES    */

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__static, "index.html"));
});

app.get("/test", (req, res) => {
    res.send("Test succeeded - app is working properly");
});

app.post("/command", (req, res, next) => {
    const line = req.body.line;
    console.log("server recieved: '" + line + "'");
    net.sendCommand(line);
});

/*    END ROUTES    */

// Run the server
app.listen(port, () => {
    console.log(`server initiated on port ${port}\n`);
});