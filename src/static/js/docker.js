// ShowDockerDropdown - Show the docker dropdown (if needed)
function ShowDockerDropdown() {
    var x = document.getElementById("docker-dropdown");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

// GetDockerData - Get the docker image and container data from the backend
function GetDockerData() {
    // Setup the request
    const req = new XMLHttpRequest();
    const url = "/dockerData";
    req.open("GET", url);
    req.send();

    // Parse the request
    req.onreadystatechange = (e) => {
        if (req.responseText != "") {
            // const parsed = JSON.parse(req.responseText);
            // console.log(parsed);
            console.log(req.responseText);
        }
    }
}

// Run on load
(function () {
    GetDockerData();
})();