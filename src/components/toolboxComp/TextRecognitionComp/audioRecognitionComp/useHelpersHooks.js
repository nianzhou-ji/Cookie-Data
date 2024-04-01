import {useStore} from "../../../../stores";

import _ from 'lodash'
const useHelpersHooks = () => {

    const convertSrt = () => {
        try {
            const originalSubtitles = toolBoxStore.audioRecognitionCompAttr.logs.join('\n')

// 将原始字幕按行分割，然后处理每一行
            const lines = originalSubtitles.trim().split('\n');
            let output = '';
            let counter = 1; // 用于序号计数

            lines.forEach((line, index) => {
                // 使用正则表达式解析时间和字幕文本
                const match = line.match(/\[(.*?)\] (.*)/);
                if (match) {
                    const [_, time, text] = match;
                    // 转换时间格式
                    const newTime = time.replace(/\./g, ',').replace(/ --> /g, ' --> ');
                    // 组合新的字幕格式
                    output += `${counter}\n${newTime}\n${text}\n\n`;
                    counter++;
                }
            });

            if (output.length !== 0) {
                // 使用Blob创建一个包含字幕内容的对象
                const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });

// 创建一个指向该Blob的URL，这个URL可以用于下载文件
                const url = URL.createObjectURL(blob);


                toolBoxStore.updateAudioRecognitionCompAttr({
                    downloadSrtUrl: url
                })
            }

        } catch (e) {

        }


    }


    const {toolBoxStore} = useStore()

    const convertTimestampToSeconds = (inputString) => {
        // Regular expression to match the timestamp format HH:MM:SS.mmm
        const timestampRegex = /-->\s*(\d{2}):(\d{2}):(\d{2}\.\d{3})/;
        const match = inputString.match(timestampRegex);

        if (match) {
            // Extract hours, minutes, and seconds.milliseconds from the match
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const secondsMilliseconds = parseFloat(match[3]);

            // Convert hours and minutes to seconds, then add them to the seconds.milliseconds part
            const totalSeconds = (hours * 3600) + (minutes * 60) + secondsMilliseconds;
            return totalSeconds;
        } else {
            return null
        }
    }


    const kMaxAudio_s = 30 * 60;
    const kMaxRecording_s = 2 * 60;
    // web audio context
    let context = null;

    // audio data

    const kSampleRate = 16000;


    // the whisper instance
    let instance = null;

    const nthreads = 8


    const storeFS = (fname, buf) => {
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

    const loadModelFile = (event, fname) => {
        const file = event.target.files[0] || null;
        if (file == null) {
            return;
        }

        console.log("loadFile: loading model: " + file.name + ", size: " + file.size + " bytes");
        console.log('loadFile: please wait ...');

        var reader = new FileReader();
        reader.onload = function (event) {
            var buf = new Uint8Array(reader.result);
            storeFS(fname, buf);

            toolBoxStore.updateAudioRecognitionCompAttr({
                loadModelState: true
            })
        }

        reader.onerror = (err) => {
            toolBoxStore.updateAudioRecognitionCompAttr({
                loadModelState: false
            })
        }
        reader.readAsArrayBuffer(file);


    }

    const loadDefaultModel = async (url, fname) => {
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            const buf = new Uint8Array(buffer);
            storeFS(fname, buf);
            console.log('load Default Model success');

            toolBoxStore.updateAudioRecognitionCompAttr({
                loadModelState: true
            })

        } catch (error) {
            console.error('load Default Model failed:', error);

            toolBoxStore.updateAudioRecognitionCompAttr({
                loadModelState: false
            })

        }
    }


    const loadAudio = (event) => {
        if (!context) {
            context = new AudioContext({
                sampleRate: kSampleRate,
                channelCount: 1,
                echoCancellation: false,
                autoGainControl: true,
                noiseSuppression: true,
            });
        }

        const file = event.target.files[0] || null;
        if (file == null) {
            return;
        }

        console.log('js: loading audio: ' + file.name + ', size: ' + file.size + ' bytes');
        console.log('js: please wait ...');

        console.log(file)


        const srcStem = file.name.replace(/(.+)\.mp4$/, '$1')


        toolBoxStore.updateAudioRecognitionCompAttr({
            srcStem:srcStem
        })

        console.log(_.cloneDeep(toolBoxStore.audioRecognitionCompAttr.srcStem))

        const reader = new FileReader();
        reader.onload = function (event) {
            const blob = new Blob([reader.result]);

            // Generate a URL for the Blob
            const blobUrl = URL.createObjectURL(blob);


            toolBoxStore.updateAudioRecognitionCompAttr({
                audioSrcUrl: blobUrl
            })


            const buf = new Uint8Array(reader.result);


            context.decodeAudioData(buf.buffer, function (audioBuffer) {
                const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

                const source = offlineContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(offlineContext.destination);
                source.start(0);

                offlineContext.startRendering().then(function (renderedBuffer) {
                    let audioObj = renderedBuffer.getChannelData(0);


                    console.log('js: audio loaded, size: ' + audioObj.length);

                    // truncate to first 30 seconds
                    if (audioObj.length > kMaxAudio_s * kSampleRate) {
                        audioObj = audioObj.slice(0, kMaxAudio_s * kSampleRate);
                        console.log('js: truncated audio to first ' + kMaxAudio_s + ' seconds');
                    }


                    toolBoxStore.updateAudioRecognitionCompAttr({
                        audio: audioObj
                    })


                    toolBoxStore.updateAudioRecognitionCompAttr({
                        loadAudioState: true
                    })


                });
            }, function (e) {
                console.log('js: error decoding audio: ' + e);
                toolBoxStore.updateAudioRecognitionCompAttr({
                    audio: null
                })

                toolBoxStore.updateAudioRecognitionCompAttr({
                    loadAudioState: false
                })

            });
        }
        reader.readAsArrayBuffer(file);
    }


    const onProcess = (translate) => {
        if (!instance) {
            // eslint-disable-next-line no-undef
            instance = Module.init('whisper.bin');

            if (instance) {
                console.log("js: whisper initialized, instance: " + instance);
            }
        }

        if (!instance) {
            console.log("js: failed to initialize whisper");
            return;
        }

        if (!toolBoxStore.audioRecognitionCompAttr.audio) {
            console.log("js: no audio data");
            return;
        }

        if (instance) {
            console.log('');
            console.log('js: processing - this might take a while ...');
            console.log('');


            setTimeout(async ()=> {
                // eslint-disable-next-line no-undef
                const ret =await Module.full_default(instance, toolBoxStore.audioRecognitionCompAttr.audio, 'en', nthreads, translate);
                console.log('js: full_default returned: ' + ret);
                if (ret) {
                    console.log("js: whisper returned: " + ret);
                }
            }, 100);
        }
    }


    return {onProcess, loadDefaultModel, loadModelFile, loadAudio, convertTimestampToSeconds, convertSrt}


}

export default useHelpersHooks