import {makeAutoObservable} from "mobx";
import _ from 'lodash'


class ToolBoxStore {

    appOpen = {
        audioRecognitionComp: false,
        videoTransformationComp: false,
        imageRecognitionComp: true

    }


    updateAppOpen(value) {
        const temp = _.cloneDeep(this.appOpen)

        if (value.imageRecognitionComp !== undefined) {
            temp.imageRecognitionComp = value.imageRecognitionComp
        }

        if (value.audioRecognitionComp !== undefined) {
            temp.audioRecognitionComp = value.audioRecognitionComp
        }

        if (value.videoFormatTransformationComp !== undefined) {
            temp.videoTransformationComp = value.videoFormatTransformationComp
        }

        this.appOpen = temp
    }


    audioRecognitionCompAttr = {
        recognizing: false,
        progress: 0,
        whisperModel: 'default',
        logs: [

        ],

        loadModelState: false,
        loadAudioState: false,
        audio: null,
        audioSrcUrl: null,
        audioDuration: 0,
        downloadSrtUrl: null,
        srtTexts: null,
        srcStem:null


    }

    updateAudioRecognitionCompAttr(value) {
        const temp = _.cloneDeep(this.audioRecognitionCompAttr)
        if (value.srcStem !== undefined) {
            temp.srcStem = value.srcStem
        }

        if (value.srtTexts !== undefined) {
            temp.srtTexts = value.srtTexts
        }

        if (value.downloadSrtUrl !== undefined) {
            temp.downloadSrtUrl = value.downloadSrtUrl
        }


        if (value.progress !== undefined) {
            temp.progress = value.progress
        }


        if (value.recognizing !== undefined) {
            temp.recognizing = value.recognizing
        }

        if (value.audioDuration !== undefined) {
            temp.audioDuration = value.audioDuration
        }

        if (value.audioDuration !== undefined) {
            temp.audioDuration = value.audioDuration
        }

        if (value.audioSrcUrl !== undefined) {
            temp.audioSrcUrl = value.audioSrcUrl
        }

        if (value.audio !== undefined) {
            temp.audio = value.audio
        }


        if (value.loadAudioState !== undefined) {
            temp.loadAudioState = value.loadAudioState
        }

        if (value.loadModelState !== undefined) {
            temp.loadModelState = value.loadModelState
        }

        if (value.whisperModel !== undefined) {
            temp.whisperModel = value.whisperModel
        }

        if (value.log !== undefined) {
            if (value.log.action === 'init') {
                temp.logs = []
            } else {
                temp.logs.push(value.log.value)
            }

        }

        this.audioRecognitionCompAttr = temp

    }


    videoTransformationCompAttr = {
        src: null,
        startTime: 0,
        endTime: 0,
        targetFormat: "GIF",
        duration: 0,
        ffmpeg: null,
        targetSrc: null,
        converting: false,
        srcName: null,
        targetSrcName: null,
        srcType: null,
        progress: 0,
        srcVideoContainerSize: null,
        targetVideoContainerSize: null,
        loadVideoState:false
    }


    getProgress(inputString) {

        try {

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

                const progress = totalSeconds / (this.videoTransformationCompAttr.endTime - this.videoTransformationCompAttr.startTime)

                this.updateVideoTransformationCompAttr({
                    progress: (progress * 100).toFixed(0)
                })

            }
        } catch (e) {
            return this.videoTransformationCompAttr.progress
        }

    }


    updateVideoTransformationCompAttr(value) {
        const temp = _.cloneDeep(this.videoTransformationCompAttr)

        if (value.loadVideoState !== undefined) {
            temp.loadVideoState = value.loadVideoState
        }

        if (value.targetVideoContainerSize !== undefined) {
            temp.targetVideoContainerSize = value.targetVideoContainerSize
        }

        if (value.srcVideoContainerSize !== undefined) {
            temp.srcVideoContainerSize = value.srcVideoContainerSize
        }

        if (value.progress !== undefined) {
            temp.progress = value.progress
        }

        if (value.srcType !== undefined) {
            temp.srcType = value.srcType
        }

        if (value.srcName !== undefined) {
            temp.srcName = value.srcName
        }

        if (value.targetSrcName !== undefined) {
            temp.targetSrcName = value.targetSrcName
        }


        if (value.src !== undefined) {
            temp.src = value.src
        }

        if (value.startTime !== undefined) {
            temp.startTime = value.startTime
        }

        if (value.endTime !== undefined) {
            temp.endTime = value.endTime
        }

        if (value.targetFormat !== undefined) {
            temp.targetFormat = value.targetFormat
        }

        if (value.duration !== undefined) {
            temp.duration = value.duration
        }

        if (value.ffmpeg !== undefined) {
            temp.ffmpeg = value.ffmpeg
        }


        if (value.ffmpeg !== undefined) {
            temp.ffmpeg = value.ffmpeg
        }


        if (value.targetSrc !== undefined) {
            temp.targetSrc = value.targetSrc
        }

        if (value.converting !== undefined) {
            temp.converting = value.converting
        }

        this.videoTransformationCompAttr = temp

    }





    sidebarItemCurrentID = ''

    setSidebarItemCurrentID(value, tag) {
        this.sidebarItemCurrentID = value
    }


    toolboxAppOpenIconState = true

    updateToolboxAppOpenIconState = (value) => {
        this.toolboxAppOpenIconState = value
    }


    constructor(rootStore) {
        this.rootStore = rootStore
        //成为响应式
        makeAutoObservable(this)
    }
}

export default ToolBoxStore


