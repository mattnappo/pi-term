function SendCommand(line, conn) {
    conn.exec(line, {
        out: function(stdout) {
            return stdout;
        }
    }).start();
}

module.exports = {
    SendCommand: SendCommand
};