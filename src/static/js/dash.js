function getStatusData() {
    $.post("/statusData", {}, (res) => {       
        RenderStatusData(res.body);
    });
}

function RenderStatusData(statusData) {
    
}