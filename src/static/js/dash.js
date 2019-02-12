function NewTerminal() {
    // window.location.href = "terminal";
    var win = window.open("terminal", "_blank");
    win.focus();
}

// function LaunchTerminal(ip) {
//     console.log(`this ip: ${ip}`);
//     $.post("/setTerminalIp", {ip: ip}, (res) => {
//         // var win = window.open("terminal", "_blank");
//         // win.focus();
//     });
// }

function LaunchTerm(terminalNumber) {
    var win = window.open("terminal" + terminalNumber, "_blank");
    win.focus();
}