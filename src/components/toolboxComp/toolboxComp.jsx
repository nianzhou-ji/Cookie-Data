import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SidebarComp from "./sidebarComp";
import VideoEditor from "./formatTransformationComp/VideoEditor/videoFormatTransformationComp";
import AudioRecognitionComp from "./TextRecognitionComp/audioRecognitionComp/audioRecognitionComp";
import VideoTransformationComp from "./formatTransformationComp/videoTransformationComp/videoTransformationComp";
import VideoFormatTransformationComp from "./formatTransformationComp/VideoEditor/videoFormatTransformationComp";

const ToolboxComp = () => {
    const {commonStore} = useStore()

    return (
        <div className={`flex ${commonStore.appCompOpenConfig.toolboxAppOpen ? null : 'hidden'} w-full h-full`}>
            <SidebarComp/>
            <div className='flex-auto h-full'>
                <VideoTransformationComp/>
                {/*<VideoFormatTransformationComp/>*/}
                <AudioRecognitionComp/>
            </div>
        </div>
    );
};

export default observer(ToolboxComp);