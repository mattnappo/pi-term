function getStatusData() {
    $.post("/statusData", {}, (res) => {       
        RenderStatusData(res.body);
    });
}

function RenderStatusData(statusData) {
    console.log(statusData);
}

(function() {
    getStatusData();
})();