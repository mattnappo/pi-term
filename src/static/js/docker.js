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
                console.log("RES: " + JSON.stringify(parsed));
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

                // Prep the document
                let containerDiv = document.getElementById("containers");
                
                // Loop through the containers
                console.log(containers["id"].length);
                for (let i = 0; i < containers["id"].length - 1; i++) {
                    // Extract the container data
                    let id = containers["id"][i];
                    let imageName = containers["image"][i];
                    let status = containers["status"][i];
                    let ports = containers["ports"][i];

                    // Create the HTML element(s)
                    let container = document.createElement("div");
                    container.className = "w3-container";
                    if (i > 0) container.style = "margin-top: 32px;"; // Don't add margin to the first container div

                    let card = document.createElement("div");
                    card.className = "w3-card";
                    container.appendChild(card);

                    let header = document.createElement("header");
                    header.className = "w3-container";
                    card.appendChild(header);
                    
                    let h3 = document.createElement("h3");
                    h3.innerHTML = id;
                    header.appendChild(h3);

                    let innerContainer = document.createElement("div");
                    innerContainer.className = "w3-container";
                    card.appendChild(innerContainer);

                    // The actual container data
                    let pImageName = document.createElement("p");
                    pImageName.innerHTML = "Image: " + imageName;
                    innerContainer.appendChild(pImageName);

                    let pStatus = document.createElement("p");
                    pStatus.innerHTML = "Uptime: " + status;
                    innerContainer.appendChild(pStatus);

                    let pPorts = document.createElement("p");
                    pPorts.innerHTML = "Ports: " + ports;
                    innerContainer.appendChild(pPorts);

                    // Create the buttons
                    let logForm = document.createElement("form");
                    logForm.target = "_blank";
                    logForm.action = "/viewLog";
                    logForm.method = "post";

                    // The hidden input containing the container's id
                    let hiddenId = document.createElement("input");
                    hiddenId.type = "hidden";
                    hiddenId.name = "id";
                    hiddenId.value = id;
                    logForm.appendChild(hiddenId);

                    let getLogButton = document.createElement("button");
                    getLogButton.className = "launch-button";
                    getLogButton.innerHTML = "View logs";
                    
                    logForm.appendChild(getLogButton);
                    innerContainer.appendChild(logForm);

                    containerDiv.appendChild(container);
                }
            }
        }
        
    }
    
}

// Run on load
(function () {
    GetDockerData();
})();