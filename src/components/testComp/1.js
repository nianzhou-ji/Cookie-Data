// Given string
let inputString = "frame= 975 fps= 25 q=-0.0 Lsize= 16407kB time=00:01:04.94 bitrate=2069.7kbits/s speed=1.63x";

// Regular expression to match the time pattern
let timePattern = /time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/;

// Extracting time substring using regular expression
let match = inputString.match(timePattern);

if (match) {
    let hours = parseInt(match[1]);
    let minutes = parseInt(match[2]);
    let seconds = parseFloat(match[3]);

    // Convert time to seconds
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    console.log("Total seconds:", totalSeconds);
} else {
    console.log("Time not found in the string.");
}

