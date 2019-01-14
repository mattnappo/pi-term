function SendCommand(line, conn) {
    conn.exec(line, {
        out: (stdout) => {
            // return stdout;
            console.log(stdout);
        }
    }).start();
}

module.exports = {
    SendCommand: SendCommand
};