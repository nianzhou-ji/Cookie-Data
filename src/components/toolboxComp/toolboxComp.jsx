import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SidebarComp from "./sidebarComp";
import AudioRecognitionComp from "./TextRecognitionComp/audioRecognitionComp/audioRecognitionComp";
import VideoTransformationComp from "./formatTransformationComp/videoTransformationComp/videoTransformationComp";

const ToolboxComp = () => {
    const {commonStore} = useStore()

    return (
        <div className={`flex ${commonStore.appCompOpenConfig.toolboxAppOpen ? null : 'hidden'} w-full h-full`}>
            <div className='h-full  p-3'>
                <SidebarComp/>
            </div>
            <div className='flex-auto h-full  p-3'>
                <VideoTransformationComp/>
                <AudioRecognitionComp/>
            </div>
        </div>
    );
};

export default observer(ToolboxComp);