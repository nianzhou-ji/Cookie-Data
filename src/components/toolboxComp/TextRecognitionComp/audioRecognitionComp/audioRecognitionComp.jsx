import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../stores";
import useHelpersHooks from "./useHelpersHooks";
import Utils from "../../../../utils";

const AudioRecognitionComp = () => {
    const {toolBoxStore} = useStore()


    const baseURL = 'http://localhost:8080/assets';

    const {onProcess, loadDefaultModel, loadModelFile, loadAudio, convertTimestampToSeconds, convertSrt} = useHelpersHooks()


    useEffect(() => {

        Utils.setElementDisabled('AudioFileEl', true)
        Utils.setElementDisabled('TranslateEl', true)


        // eslint-disable-next-line no-undef
        Module["whisperRecognizeResultCallback"] = (text) => {
            // console.log(text, 'whisperRecognizeResultCallback')

            toolBoxStore.updateAudioRecognitionCompAttr(
                {
                    log: {
                        action: 'add',
                        value: text
                    }
                }
            )


            if (convertTimestampToSeconds(text) !== null) {
                toolBoxStore.updateAudioRecognitionCompAttr(
                    {

                        progress: (convertTimestampToSeconds(text) / toolBoxStore.audioRecognitionCompAttr.audioDuration * 100).toFixed(0)
                    }
                )
            }


            if (toolBoxStore.audioRecognitionCompAttr.progress > 100 || toolBoxStore.audioRecognitionCompAttr.progress === 100) {
                toolBoxStore.updateAudioRecognitionCompAttr(
                    {

                        recognizing: false,
                    }
                )


                convertSrt()
            }

        }


    }, []);


    useEffect(() => {


        Utils.setElementDisabled('TranslateEl', !toolBoxStore.audioRecognitionCompAttr.loadAudioState)


    }, [toolBoxStore.audioRecognitionCompAttr.loadAudioState]);


    useEffect(() => {

        Utils.setElementDisabled('AudioFileEl', !toolBoxStore.audioRecognitionCompAttr.loadModelState)

    }, [toolBoxStore.audioRecognitionCompAttr.loadModelState]);

    return (
        <div className={`h-full w-full flex ${toolBoxStore.appOpen.audioRecognitionComp ? null : 'hidden'}`}>


            <div className='flex-auto'>

                <label className="form-control  ">
                    <div className="label">
                            <span
                                className="label-text font-bold text-2xl">Whisper model</span>
                    </div>


                    <div className='flex'>
                        <select className="select select-bordered w-full" onChange={e => {
                            toolBoxStore.updateAudioRecognitionCompAttr(
                                {
                                    whisperModel: e.target.value,
                                    loadModelState: false
                                }
                            )
                        }}>
                            <option value={'default'}>Default Model</option>
                            <option value={'other'}>Upload Modal</option>
                        </select>
                        <button
                            className={`${toolBoxStore.audioRecognitionCompAttr.whisperModel === 'default' ? null : 'hidden'} btn btn-neutral ml-2`}
                            onClick={async () => {
                                await loadDefaultModel(`${baseURL}/SampleDemo/ggml-tiny.en.bin`, 'whisper.bin')

                            }}>Load Modal
                        </button>


                    </div>


                    <input type="file"
                           className={`${toolBoxStore.audioRecognitionCompAttr.whisperModel === 'other' ? null : 'hidden'} my-3 file-input file-input-bordered w-[100%]`}
                           onChange={e => {
                               loadModelFile(e, 'whisper.bin')
                           }}/>

                </label>


                <label id={'AudioFileEl'} className="form-control  mt-3">
                    <div className="label">
                            <span
                                className="label-text font-bold text-2xl">Audio file</span>
                    </div>

                    <input type="file" className="mb-3 file-input file-input-bordered w-[100%]"
                           onChange={e => {

                               toolBoxStore.updateAudioRecognitionCompAttr({
                                   loadAudioState: false,
                                   recognizing: false,

                               })

                               loadAudio(e)
                           }}/>

                </label>


                <audio id={'audioPlayerEl'} className='w-full mt-3'
                       src={toolBoxStore.audioRecognitionCompAttr.audioSrcUrl} controls onLoadedMetadata={event => {

                    toolBoxStore.updateAudioRecognitionCompAttr(
                        {
                            audioDuration: document.getElementById('audioPlayerEl').duration
                        }
                    )

                }}></audio>


            </div>


            <div className=" divider divider-horizontal h-full"/>


            <div className=' h-full max-h-full w-[60%] min-w-[60%] max-w-[60%]  flex flex-col p-3' id={'TranslateEl'}>

                <div>

                    <button className='btn btn-neutral' onClick={() => {

                        toolBoxStore.updateAudioRecognitionCompAttr(
                            {
                                log: {
                                    action: 'init',
                                },
                                recognizing: true,
                                downloadSrtUrl: null,
                                srtTexts: null,
                            }
                        )


                        onProcess(false)


                    }}>translate
                    </button>


                    <div
                        className={`radial-progress ml-6 ${toolBoxStore.audioRecognitionCompAttr.recognizing ? null : 'hidden'}`}
                        style={{
                            "--value": toolBoxStore.audioRecognitionCompAttr.progress,
                            "--size": "3rem",
                            "--thickness": "4px"
                        }}
                        role="progressbar">{toolBoxStore.audioRecognitionCompAttr.progress}%
                    </div>


                    <button
                        className={`${toolBoxStore.audioRecognitionCompAttr.downloadSrtUrl === null ? 'hidden' : null} btn btn-neutral ml-3`}
                        onClick={() => {
                            // 创建一个下载链接
                            const a = document.createElement('a');
                            a.href = toolBoxStore.audioRecognitionCompAttr.downloadSrtUrl;
                            a.download = `${toolBoxStore.audioRecognitionCompAttr.srcStem}.srt`; // 指定下载文件的名称
                            // 触发下载
                            document.body.appendChild(a);
                            a.click();

                            // 清理
                            document.body.removeChild(a);
                        }}
                    >Download
                    </button>

                </div>


                <div
                    className='bg-black flex-auto  max-h-[30rem] mt-3  rounded-2xl text-white p-3 flex flex-col  overflow-y-auto'>

                    {toolBoxStore.audioRecognitionCompAttr.logs.map((value, index) => <div key={index}
                                                                                           className='mt-3'>
                        {value}
                    </div>)}
                </div>

            </div>


        </div>
    );
};

export default observer(AudioRecognitionComp);