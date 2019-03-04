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
            console.log(req.responseText);
            // Parse the request
            let res = JSON.parse(req.responseText);
            
            // Render the container id
            let idDiv = document.getElementById("id");
            idDiv.innerHTML = res["id"];

            // Render the log
            let logDiv = document.getElementById("log");
            logDiv.innerHTML = res["log"];
        }
    }
}

// Run on load
(function () {
    GetLogData();
})();