// GetStatusData - Get the ping times and uptimes for all of the pis, and render them to the DOM
function GetStatusData() {
    const Http = new XMLHttpRequest();
    const url= "/statusData";
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.responseText != "") {
            // Render the pings
            const pingpis = JSON.parse(Http.responseText)["pings"];
            for (var pi in pingpis) {
                if (pingpis.hasOwnProperty(pi)) {
                    document.getElementById("ping" + pi[pi.length - 1]).innerHTML = "Ping: " + pingpis[pi];
                }
            }

            // Render the uptimes
            const uptimepis = JSON.parse(Http.responseText)["uptimes"];
            for (var pi in uptimepis) {
                if (uptimepis.hasOwnProperty(pi)) {
                    document.getElementById("uptime" + pi[pi.length - 1]).innerHTML = uptimepis[pi];
                }
            }
        }
    }
}

(function() {
    GetStatusData();
})();