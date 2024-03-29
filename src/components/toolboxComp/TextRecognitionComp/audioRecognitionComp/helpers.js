class Helpers {


    static kMaxAudio_s = 30*60;
    static kMaxRecording_s = 2*60;
         // web audio context
    static context = null;

    // audio data
    static audio = null;

    static  kSampleRate = 16000;


    // the whisper instance
    static instance = null;

    static  nthreads = 8


    static storeFS = (fname, buf) => {
        // write to WASM file using FS_createDataFile
        // if the file exists, delete it
        try {
            // eslint-disable-next-line no-undef
            Module.FS_unlink(fname);
        } catch (e) {
            // ignore
        }

        // eslint-disable-next-line no-undef
        Module.FS_createDataFile("/", fname, buf, true, true);

        //model_whisper = fname;
        console.log('storeFS: stored   model: ' + fname + ' size: ' + buf.length);

    }

    static loadFile = (event, fname) => {
        const file = event.target.files[0] || null;
        if (file == null) {
            return;
        }

        console.log("loadFile: loading model: " + file.name + ", size: " + file.size + " bytes");
        console.log('loadFile: please wait ...');

        var reader = new FileReader();
        reader.onload = function (event) {
            var buf = new Uint8Array(reader.result);
            Helpers.storeFS(fname, buf);
        }
        reader.readAsArrayBuffer(file);



    }


    static loadAudio = (event) => {
        if (!Helpers.context) {
            Helpers.context = new AudioContext({
                sampleRate: Helpers.kSampleRate,
                channelCount: 1,
                echoCancellation: false,
                autoGainControl:  true,
                noiseSuppression: true,
            });
        }

        const file = event.target.files[0] || null;
        if (file == null) {
            return;
        }

        console.log('js: loading audio: ' + file.name + ', size: ' + file.size + ' bytes');
        console.log('js: please wait ...');

        const reader = new FileReader();
        reader.onload = function(event) {
            const buf = new Uint8Array(reader.result);

            Helpers.context.decodeAudioData(buf.buffer, function(audioBuffer) {
                const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
                const source = offlineContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(offlineContext.destination);
                source.start(0);

                offlineContext.startRendering().then(function(renderedBuffer) {
                    Helpers.audio = renderedBuffer.getChannelData(0);
                    console.log('js: audio loaded, size: ' +  Helpers.audio.length);

                    // truncate to first 30 seconds
                    if (  Helpers.audio.length >   Helpers.kMaxAudio_s*  Helpers.kSampleRate) {
                        Helpers.audio =   Helpers.audio.slice(0,  Helpers.kMaxAudio_s* Helpers.kSampleRate);
                        console.log('js: truncated audio to first ' +  Helpers.kMaxAudio_s + ' seconds');
                    }


                });
            }, function(e) {
                console.log('js: error decoding audio: ' + e);
                Helpers.audio = null;
            });
        }
        reader.readAsArrayBuffer(file);
    }


    static onProcess=(translate)=> {
        if (!Helpers.instance) {
            // eslint-disable-next-line no-undef
            Helpers.instance = Module.init('whisper.bin');

            if (Helpers.instance) {
                console.log("js: whisper initialized, instance: " + Helpers.instance);
            }
        }

        if (!Helpers.instance) {
            console.log("js: failed to initialize whisper");
            return;
        }

        if (!Helpers.audio) {
            console.log("js: no audio data");
            return;
        }

        if (Helpers.instance) {
            console.log('');
            console.log('js: processing - this might take a while ...');
            console.log('');


            setTimeout(function() {
                // eslint-disable-next-line no-undef
                const ret = Module.full_default(Helpers.instance, Helpers.audio, 'en', Helpers.nthreads, translate);
                console.log('js: full_default returned: ' + ret);
                if (ret) {
                    console.log("js: whisper returned: " + ret);
                }
            }, 100);
        }
    }

}

export default Helpers