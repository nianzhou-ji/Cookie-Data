import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SidebarComp from "./sidebarComp";
import AudioRecognitionComp from "./TextRecognitionComp/audioRecognitionComp/audioRecognitionComp";
import VideoTransformationComp from "./formatTransformationComp/videoTransformationComp/videoTransformationComp";
import ImageRecognitionComp from "./TextRecognitionComp/imageRecognitionComp/imageRecognitionComp";

const ToolboxComp = () => {
    const {commonStore, toolBoxStore} = useStore()
    useEffect(() => {
        let waitedItemSubID = null

        if (toolBoxStore.appOpen.videoTransformationComp) {
            waitedItemSubID = 'eac31d7d'

        }

        if (toolBoxStore.appOpen.audioRecognitionComp) {
            waitedItemSubID = 'eac31tt7s'

        }

        if (toolBoxStore.appOpen.imageRecognitionComp) {
            waitedItemSubID = 'ea831d7s'
        }

        if (waitedItemSubID !== null ) {

            document.getElementById(waitedItemSubID).click()
        }

    }, []);

    return (
        <div className={`flex ${commonStore.appCompOpenConfig.toolboxAppOpen ? null : 'hidden'} w-full h-full`}>
            <div className='h-full  p-3'>
                <SidebarComp/>
            </div>
            <div className='flex-auto h-full  p-3'>
                <VideoTransformationComp/>
                <AudioRecognitionComp/>
                <ImageRecognitionComp/>
            </div>
        </div>
    );
};

export default observer(ToolboxComp);