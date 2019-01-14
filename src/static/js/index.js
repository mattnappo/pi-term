var util = util || {};
util.toArray = function (list) {
    return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    
    var output_ = document.querySelector(outputContainer);
    var cmdLine_ = document.querySelector(cmdLineContainer);

    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

    window.addEventListener("click", function (e) {
        cmdLine_.focus();
    }, false);

    cmdLine_.addEventListener("click", inputTextClick_, false);
    cmdLine_.addEventListener("keydown", historyHandler_, false);
    cmdLine_.addEventListener("keydown", processNewCommand_, false);

    function inputTextClick_(e) {
        this.value = this.value;
    }

    function historyHandler_(e) {
        if (history_.length) {
            if (e.keyCode == 38 || e.keyCode == 40) {
                if (history_[histpos_]) {
                    history_[histpos_] = this.value;
                } else {
                    histtemp_ = this.value;
                }
            }

            if (e.keyCode == 38) { // up
                histpos_--;
                if (histpos_ < 0) {
                    histpos_ = 0;
                }
            } else if (e.keyCode == 40) { // down
                histpos_++;
                if (histpos_ > history_.length) {
                    histpos_ = history_.length;
                }
            }

            if (e.keyCode == 38 || e.keyCode == 40) {
                this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
                this.value = this.value; // Sets cursor to end of input.
            }
        }
    }

    function output(html) {
        output_.insertAdjacentHTML("beforeEnd", "<p>" + html + "</p>");
    }

    function processNewCommand_(e) {
        // Implement tab suggestions
        if (e.keyCode == 9) { // tab
            e.preventDefault();
        } else if (e.keyCode == 13) { // enter
            // Save shell history.
            if (this.value) {
                history_[history_.length] = this.value;
                histpos_ = history_.length;
            }

            // Duplicate current input and append to output section.
            var line = this.parentNode.parentNode.cloneNode(true);
            line.removeAttribute("id")
            line.classList.add("line");
            var input = line.querySelector("input.cmdline");
            input.autofocus = false;
            input.readOnly = true;
            output_.appendChild(line);

            if (this.value == "h") {
                putline("working h");
            }
            // Send the line to the backend
            $.post("/command", {
                line: this.value,
                address: "192.168.1.101"
            }, (line) => {
                console.log(`"${line}" submitted from the front end`)
            });

            // Clear/setup line for next input.
            window.scrollTo(0, getDocHeight_());
            this.value = "";
        }
    }

    // Cross-browser impl to get document"s height.
    function getDocHeight_() {
        var d = document;
        return Math.max(
            Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
            Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
            Math.max(d.body.clientHeight, d.documentElement.clientHeight)
        );
    }

    return {
        init: function () {
            output("");
        },
        output: output
    }
};

function putline(line) {
    var output_ = document.querySelector(outputContainer);
    var p = document.createElement("p");
    p.innerHTML = line
    p.appendChild(document.createElement("br"))
    output_.insertAdjacentHTML("beforeEnd", p.innerHTML);
    console.log(output_)
    // output_.appendChild(line);
}

// Set the command-line prompt to include the user"s IP Address
$(".prompt").html("[root@PiOne] # ");

// Initialize a new terminal object
var outputContainer = "#container output";
var term = new Terminal("#input-line .cmdline", outputContainer);
term.init();