/********************************************************************
//   Define custom user behaviour log functions
 **********************************************************************/
function writeLog(time, type, content){
    // if (type == 'CONTROLBAR') {
    //     document.getElementById("logText").innerHTML += '[' + time + '] ' + '[' + type + '] [' + content + ']&#10';
    // }
    document.getElementById("logText").innerHTML += '[' + time + '] ' + '[' + type + '] [' + content + ']&#10';
}

function startVideo() {


    var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
    // var url = "http://127.0.0.1:8080";
    var link = document.getElementById("server-link").value+":"+document.getElementById("port-link").value;
    // httpRequest.withCredentials=true;
    httpRequest.open('POST', link, true); //第二步：打开连接
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
    var trace = document.getElementById("trace-link").value;
    httpRequest.send('start=true&trace='+trace);//发送请求


    loglen = 0;
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('logText');
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                loglen += 1
                document.getElementById("logcount").innerHTML = "(" + loglen + " line(s)):"
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    var url = document.getElementById("mpd-link").value;
    var video = document.querySelector(".dash-video-player video");


    document.getElementById("logText").innerHTML += "#[SERVER] [" + document.getElementById("server-link").value + "]&#10";
    document.getElementById("logText").innerHTML += "#[PORT] [" + document.getElementById("port-link").value + "]&#10";
    document.getElementById("logText").innerHTML += "#[TRACE] [" + document.getElementById("trace-link").value + "]&#10";
    document.getElementById("logText").innerHTML += "#[MPD] [" + url + "]&#10";
    document.getElementById("logText").innerHTML += "[" + Date.now() + "] [START] [START_OF_LOG]&#10";

    // DASH JS VIDEO PLAYER
    // [PASS] Multi Video Bitrates: https://cmafref.akamaized.net/cmaf/live-ull/2006350/akambr/out.mpd
    // [PASS] Multi Audio Bitrates: https://dash.akamaized.net/dash264/TestCases/3a/fraunhofer/aac-lc_stereo_without_video/ElephantsDream/elephants_dream_audio_only_aaclc_stereo_sidx.mpd
    // [PASS] Multi Caps/Subs: https://livesim.dashif.org/livesim/testpic_2s/multi_subs.mpd
    // [PASS] Live with playback: https://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd



    player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);
    player.updateSettings({
        'debug': {
            // **********  SET VERBOSE LEVEL **********
            'logLevel': dashjs.Debug.LOG_LEVEL_DEBUG
            // ****************************************
        }
    });
    // CONTROLBAR
    controlbar = new ControlBar(player, false);
    controlbar.initialize();
}

function saveTextAsFile() {

    var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
    var url = document.getElementById("server-link").value+":"+document.getElementById("port-link").value;
    // httpRequest.withCredentials=true;
    httpRequest.open('POST', url, true); //第二步：打开连接
    httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
    httpRequest.send('start=false');//发送请求

    var textToWrite = document.getElementById('logText').innerHTML;
    console.log(textToWrite);
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var fileNameToSaveAs = "log.text";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}