import React from 'react';
import {useStore} from "../../../../stores";

const ImageRecognitionComp = () => {
    const {toolBoxStore} = useStore()
    return (
        <div className={`flex h-full w-full ${toolBoxStore.appOpen.imageRecognitionComp ? null : 'hidden'}`}>
            imageRecognitionComp
        </div>
    );
};

export default ImageRecognitionComp;