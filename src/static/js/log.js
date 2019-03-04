// GetLogData - Get and render the container's log
function GetLogData() {
    // Setup the request
    const req = new XMLHttpRequest();
    const url = "/getContainerLog";
    req.open("GET", url);
    req.send();

    // Parse the request
    req.onreadystatechange = (e) => {
        if (req.responseText != "") {
            // Render the pings
            let log = JSON.parse(req.responseText)["log"];
            log = JSON.stringify(log);

            let logDiv = document.getElementById("log");
            logDiv.innerHTML = log;
        }
    }
}

// Run on load
(function () {
    GetLogData();
})();