import {makeAutoObservable} from "mobx";
import _ from 'lodash'


class ToolBoxStore {

    appOpen = {
        audioRecognitionComp: false,
        videoTransformationComp: true

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
        srcVideoContainerSize:null,
        targetVideoContainerSize:null
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

                const progress = totalSeconds/(this.videoTransformationCompAttr.endTime-this.videoTransformationCompAttr.startTime)

                this.updateVideoTransformationCompAttr({
                    progress:(progress*100).toFixed(0)
                })

            }
        }catch (e){
            return this.videoTransformationCompAttr.progress
        }

    }


    updateVideoTransformationCompAttr(value) {
        const temp = _.cloneDeep(this.videoTransformationCompAttr)
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


    updateAppOpen(value) {
        const temp = _.cloneDeep(this.appOpen)
        if (value.audioRecognitionComp !== undefined) {
            temp.audioRecognitionComp = value.audioRecognitionComp
        }

        if (value.videoFormatTransformationComp !== undefined) {
            temp.videoTransformationComp = value.videoFormatTransformationComp
        }

        this.appOpen = temp
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


