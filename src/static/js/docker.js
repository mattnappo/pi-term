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
        if (req.readyState == 3) {
            if (req.responseText != "") {
                // Parse the response
                const parsed = JSON.parse(req.responseText);
                // console.log("RES: " + JSON.stringify(parsed));
                const images = parsed["images"];
                const containers = parsed["containers"];
    
                // Prep the document
                let div = document.getElementById("docker-image-names");
        
                // Loop through all the images
                for (let i = 0; i < images["repositories"].length; i++) {
                    /* BEGIN REPO NAMES */
                    // Replace <> with &lt; &gt;
                    let repo = images["repositories"][i];
                    repo = repo.replace(/</g, "&lt;");
                    repo = repo.replace(/>/g, "&gt;");
                    
                    // Add to the document
                    let pRepoName = document.createElement("p");
                    pRepoName.innerHTML = repo;
                    div.appendChild(pRepoName);
                    /* END REPO NAMES */
    
                    /* BEGIN IMAGE TIMES */
                    // Add the image times
                    let createdDiv = document.getElementById("docker-image-times");
                    let pTimeCreated = document.createElement("p");
                    pTimeCreated.innerHTML = images["created"][i];
                    createdDiv.appendChild(pTimeCreated);
                    /* END IMAGE TIMES */
    
                }
            }
        }
        
    }
    
}

// Run on load
(function () {
    GetDockerData();
})();