import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../stores";
import Helpers from "./helpers";
const AudioRecognitionComp = () => {
    const {toolBoxStore} = useStore()


    useEffect(() => {
        // eslint-disable-next-line no-undef
        Module["whisperRecognizeResultCallback"] = (text)=>{
            console.log(text, 'whisperRecognizeResultCallback')
        }

    }, []);
    return (
        <div className={`${toolBoxStore.appOpen.audioRecognitionComp ? null : 'hidden'}`}>
                    <p>加载Whisper Model：</p>
                    <input type="file" onChange={e => {
                        Helpers.loadFile(e, 'whisper.bin')
                    }}/>


                    <div>
                        加载Audio file:
                        <input type="file" id="file" name="file" onChange={e => Helpers.loadAudio(e)}/>
                    </div>


                    <button className='btn' onClick={() => {
                        Helpers.onProcess(false)
                    }}>translate
                    </button>



        </div>
    );
};

export default observer(AudioRecognitionComp);