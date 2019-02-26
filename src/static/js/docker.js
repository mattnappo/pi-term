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
            console.log(req.responseText);
            
            const parsed = JSON.parse(req.responseText);
            const images = parsed["images"];
            const containers = parsed["containers"];

            let div = document.getElementById("docker-image-names");
            for (let i = 0; i < images["repositories"].length; i++) {
                console.log(`i: ${images["repositories"][i]}`);
                let pRepoName = document.createElement("p");
                pRepoName.innerHTML = images["repositories"][i];
                div.appendChild(pRepoName);
                
                let createdDiv = document.getElementById("docker-image-times");
                let pTimeCreated = document.createElement("p");
                pTimeCreated.innerHTML = images["created"][i];
                createdDiv.appendChild(pTimeCreated);

            }
        }
    }
}

// Run on load
(function () {
    GetDockerData();
})();