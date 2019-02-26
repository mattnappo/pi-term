const docker = require("./docker");
const cpu = require("./cpu");

// I am aware that this is a really bad solution to this whole problem
if (process.argv[2] == "--dockerinfo") {
    docker.GetInfo();
    /*
        To call (from express.js backend), do this:
        // Make an init helpers func that installs latest code to helpers
        execSync("node ~/git/pi-term/helpers/ && cat ~/git/pi-term/helpers/docker.info")
    */

} else if (process.argv[2] == "--cpuinfo") {
    cpu.GetInfo();
} else {
    console.log("Invalid helper parameter. Options:\n--dockerinfo\n--cpuinfo");
}