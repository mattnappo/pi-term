
function GetPingData() {
    const Http = new XMLHttpRequest();
    const url= "/statusData";
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.responseText != "") {
            console.log(Http.responseText);
            const pis = JSON.parse(Http.responseText);
            for (var pi in pis) {
                if (pis.hasOwnProperty(pi)) {
                    console.log("ping" + pi[pi.length - 1]);
                    document.getElementById("ping" + pi[pi.length - 1]).innerHTML = pis[pi];
                }
            }
        }
    }

}

(function() {
    GetPingData();
})();