import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SidebarComp from "./sidebarComp";
import VideoEditor from "./subComp/VideoEditor/videoFormatTransformationComp";
import AudioRecognitionComp from "./subComp/audioRecognitionComp/audioRecognitionComp";

const ToolboxComp = () => {
    const {commonStore} = useStore()

    return (
        <div className={`flex ${commonStore.appCompOpenConfig.toolboxAppOpen ? null : 'hidden'} w-full`}>
            <SidebarComp/>
            <div className='flex-auto'>
                <VideoEditor/>
                <AudioRecognitionComp/>
            </div>
        </div>
    );
};

export default observer(ToolboxComp);