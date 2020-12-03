const https = require('https');
const fs = require('fs');
const { apiKey } = require('../clientSecrets.json');

let watchedTime = 0;
var videosParsed = 0;
var vidData = require('../watch-history.json');

vidData = vidData.filter(vid => Date.now() - Date.parse(vid.time) < 31536000000 && vid.title != 'Watched a video that has been removed');

doingRecursion(0);

function doingRecursion(index){
    if (index == vidData.length){
        fs.writeFileSync('lastRun.out', "Total time (seconds): " + formatSecondsAsTime(watchedTime) + ` (${watchedTime}) ` + vidData.length + " videos in the past year. \nAverage time (seconds): " + formatSecondsAsTime(watchedTime / vidData.length) + ` (${(watchedTime / vidData.length).toFixed(5)}) `);
        process.exit(0);
    }
    var vid = vidData[index];
    var req = https.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=${apiKey}&id=` + vid.titleUrl.split('watch?v\u003d')[1], (res) => {
        var json = '';

        res.on('data', function (chunk) {
            json += chunk;
        });

        res.on('end', function () {
            if (res.statusCode === 200) {
                try {
                    var data = JSON.parse(json);
                    // data is available here:
                    videosParsed++;
                    //console.log(data);
                    watchedTime += strangeStringToTime(data.items[0].contentDetails.duration);
                    process.stdout.write('\r');
                    process.stdout.write(formatSecondsAsTime(watchedTime) + ` (${watchedTime})` + " => " + (100 * videosParsed / vidData.length).toPrecision(4) + "%");
                } catch (e) {
                    console.log('Error parsing JSON!');
                }
            } else {
                console.log(res);
                console.log('Status:', res.statusCode);
                if (res.statusCode == 403)
                    process.exit(2);
            }
            doingRecursion(index + 1);
        });
    });
}

function strangeStringToTime(strangeString = "") {
    //var holdover = strangeString;
    var time = 0;
    strangeString = strangeString.replace('PT', '');
    if (strangeString.includes("H")) {
        time += 3600 * parseInt(strangeString.charAt(0) + (strangeString.charAt(1) == 'H' ? '' : strangeString.charAt(1)))
        strangeString = strangeString.substring(strangeString.indexOf('H') + 1, strangeString.length);
    }
    if (strangeString.includes("M")) {
        time += 60 * parseInt(strangeString.charAt(0) + (strangeString.charAt(1) == 'M' ? '' : strangeString.charAt(1)))
        strangeString = strangeString.substring(strangeString.indexOf('M') + 1, strangeString.length);
    }
    if (strangeString.includes("S")) {
        time += parseInt(strangeString.charAt(0) + (strangeString.charAt(1) == 'S' ? '' : strangeString.charAt(1)))
        strangeString = strangeString.substring(strangeString.indexOf('S') + 1, strangeString.length);
    }
    //console.log(holdover + ': ' + time);
    return time;
}

function formatSecondsAsTime(secs) {
    var hr = Math.floor(secs / 3600),
        min = Math.floor((secs - (hr * 3600)) / 60),
        sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (hr < 10) {
        hr = "0" + hr;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return hr + ':' + min + ':' + sec;
};