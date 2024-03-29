import {makeAutoObservable} from "mobx";
import _ from 'lodash'



class ToolBoxStore {

    appOpen={
        audioRecognitionComp:true,
        videoFormatTransformationComp:false

    }


    updateAppOpen(value){
        const temp = _.cloneDeep(this.appOpen)
        if(value.audioRecognitionComp!==undefined){
            temp.audioRecognitionComp = value.audioRecognitionComp
        }

        if(value.videoFormatTransformationComp!==undefined){
            temp.videoFormatTransformationComp = value.videoFormatTransformationComp
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


