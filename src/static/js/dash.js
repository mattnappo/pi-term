function getStatusData() {
    $.post("/statusData", {}, (res) => {       
        RenderStatusData(JSON.stringify(res.body));
    });
}

function RenderStatusData(statusData) {
    console.log(statusData);
}

(function() {
    getStatusData();
})();