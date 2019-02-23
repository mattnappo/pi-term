// Imports
const execSync = require("child_process").execSync;
const fs = require("fs");

// sendCommandAndParse - Exec a command on the host and parse it accordingly
function sendCommandAndParse(command) {
    let stdout = execSync(command).toString("utf8");
    let stripped = stdout.replace(/"/g, "");
    let parsed = stripped.split("\n");
    return parsed;
}

// GetImageInfo - Get the image info and write to a file
function GetImageInfo() {
    let data = {
        repositories: sendCommandAndParse("docker images --format '{{json .Repository}}'"),
        created: sendCommandAndParse("docker images --format '{{json .CreatedSince}}'")
    };

    // Write to file
    // fs.writeFile("docker.image.info", JSON.stringify(data), function (err, data) {
    //     if (err) console.log(err);
    // });

    return data;
}

// GetContinerInfo - Get the running container info and write to a file
function GetContinerInfo() {
    let data = {
        id: sendCommandAndParse("docker ps --no-trunc --format '{{json .ID}}'"),
        image: sendCommandAndParse("docker ps --format '{{json .Image}}'"),
        status: sendCommandAndParse("docker ps --format '{{json .Status}}'")
    };

    // Write to file
    // fs.writeFile("docker.container.info", JSON.stringify(data), function (err, data) {
    //     if (err) console.log(err);
    // });

    return data;
}

// GetInfo - Get all of the docker info (images and containers)
function GetInfo() {
    let data = {
        images: GetImageInfo(),
        container: GetContinerInfo()
    }
    
    // Write to file
    fs.writeFile("docker.info", JSON.stringify(data), function (err, data) {
        if (err) console.log(err);
    });
}

// Export necessary functions
module.exports = {
    GetImageInfo: GetImageInfo,
    GetContinerInfo: GetContinerInfo,
    GetInfo: GetInfo
};