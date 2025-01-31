{
let inject = function() {
    if (document.URL.indexOf('/watch') == -1)
        return;	
	var oldBtns = document.getElementsByClassName('zsButton');
	while (oldBtns.length > 0) {
		oldBtns[0].remove();
		var oldBtns = document.getElementsByClassName('zsButton');
	}
	


    monoContext = null;
    audioSource = null;

    function switchToMono() {
        monoContext = new AudioContext();
        var video = document.querySelector('video');
        rewireToMono(video, monoContext);
    }

    function rewireToMono(audioElement, audioContext) {

        audioSource = audioContext.createMediaElementSource(audioElement);

        const volumeNodeL = new GainNode(audioContext);
        const volumeNodeR = new GainNode(audioContext);

        volumeNodeR.gain.value = 2;
        volumeNodeL.gain.value = 2;

        const channelsCount = 2; // or read from: 'audioSource.channelCount'
        const splitterNode = new ChannelSplitterNode(audioContext, {
            numberOfOutputs: channelsCount
        });
        const mergerNode = new ChannelMergerNode(audioContext, {
            numberOfInputs: channelsCount
        });

        audioSource.connect(splitterNode);
        splitterNode.connect(volumeNodeR, 0); // connect OUTPUT channel 0
        splitterNode.connect(volumeNodeL, 1); // connect OUTPUT channel 1
        //mono
        volumeNodeR.connect(mergerNode, 0, 1); // connect INPUT channel 1
        volumeNodeL.connect(mergerNode, 0, 1); // connect INPUT channel 1
        volumeNodeR.connect(mergerNode, 0, 0); // connect INPUT channel 0
        volumeNodeL.connect(mergerNode, 0, 0); // connect INPUT channel 0

        mergerNode.connect(audioContext.destination);
    }

    function downloadNoResize() {
        var v = document.querySelector('video');
        download(v.videoWidth, v.videoHeight);
    }

    function download(w, h) {
        function saveBase64AsFile(base64, fileName) {
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.setAttribute('href', base64);
            link.setAttribute('download', fileName);
            link.click();
        }
        var v = document.querySelector('video');
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        var ctx = c.getContext('2d');
        ctx.drawImage(v, 0, 0, w, h);
        var n = document.querySelector('div.ytp-title > div > a').text;
        saveBase64AsFile(c.toDataURL(), n + '.png');
    }
	
	var fontSize = '20px';
	var className = 'ytp-button zsButton';

    var cont = document.querySelector("#info-container");
    var monoBtn = document.createElement('div');
    monoBtn.innerText = '🎙️';
    monoBtn.className = className;
    monoBtn.style.fontSize = fontSize;
    monoBtn.onclick = switchToMono;
    cont.appendChild(monoBtn);

    var screenshotBtn = document.createElement('div');
    screenshotBtn.innerText = '📷';
    screenshotBtn.className = className;
	screenshotBtn.style.fontSize = fontSize;
    screenshotBtn.onclick = downloadNoResize;    
    cont.appendChild(screenshotBtn);
	
	var x3btn = document.createElement('div');
    x3btn.innerText = '⏩';
    x3btn.className = className;
	x3btn.style.fontSize = fontSize;
    x3btn.onclick = () => {
		document.querySelector('video').playbackRate = 3;		
	};   
    cont.appendChild(x3btn);
	
	var invertBtn = document.createElement('div');
    invertBtn.innerText = '☯';
    invertBtn.className = className;
	invertBtn.style.fontSize = fontSize;
    invertBtn.onclick = () => {
		var style = document.getElementById('invert_video_filter');
		if (style) {
			style.remove();
		} else {
			style = document.createElement('style');
			style.textContent = 
			`video {
				filter: invert(100%)! important;
				webkitFilter: invert(100%)! important;
			}`;
			style.id = 'invert_video_filter';
			document.head.append(style);			
		}
	};   
    cont.appendChild(invertBtn);
};

document.addEventListener('yt-navigate-finish', function(event) {
	setTimeout(inject, 2000);
});

}	