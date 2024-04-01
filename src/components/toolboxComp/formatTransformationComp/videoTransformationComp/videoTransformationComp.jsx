import React, {useEffect, useRef} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../stores";
import _ from 'lodash'
import {FFmpeg} from '@ffmpeg/ffmpeg'
import {fetchFile, toBlobURL} from '@ffmpeg/util'
import Utils from "../../../../utils";

const VideoTransformationComp = () => {
    const {toolBoxStore, commonStore} = useStore()


    const videoRef = useRef(null)


    const loadFfmpeg = async () => {
        const ffmpeg = new FFmpeg()
        const baseURL = 'http://localhost:8080/assets/ffmpeg';
        // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd'
        ffmpeg.on('log', ({message}) => {
            console.log('log:', message)
            toolBoxStore.getProgress(message)
        });


        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
        });

        toolBoxStore.updateVideoTransformationCompAttr({
            ffmpeg: ffmpeg
        })


        console.log('ffmpeg init success')

    }

    useEffect(() => {
        loadFfmpeg()

        Utils.setElementDisabled('videoContainer', true)
    }, []);





    const getContainerSize = (id)=>{
        return document.getElementById(id)?.getBoundingClientRect()
    }

    return (
        <div className={`flex h-full ${toolBoxStore.appOpen.videoTransformationComp ? null : 'hidden'}`}>

            <div className='h-full flex flex-col w-[50%]'>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text font-bold text-2xl">Upload a video</span>
                    </div>
                    <input type="file" className="mb-3 file-input file-input-bordered w-[100%]"
                           accept={".mp4, .avi"}
                           onChange={(event) => {
                               const file = event.target.files[0];
                               if (file) {
                                   console.log(file)
                                   toolBoxStore.updateVideoTransformationCompAttr({
                                       src: null,
                                       startTime: 0,
                                       endTime: 0,
                                       duration: 0,
                                       targetSrc: null,
                                       converting: false,
                                       srcName: file.name,
                                       srcType: file.type
                                   });

                                   if(toolBoxStore.videoTransformationCompAttr.srcVideoContainerSize===null) {
                                       toolBoxStore.updateVideoTransformationCompAttr({
                                           srcVideoContainerSize:getContainerSize('srcVideoContainer')
                                       });
                                   }



                                   if(toolBoxStore.videoTransformationCompAttr.targetVideoContainerSize===null) {
                                       toolBoxStore.updateVideoTransformationCompAttr({
                                           targetVideoContainerSize:getContainerSize('targetVideoContainer')
                                       });
                                   }


                                   const reader = new FileReader();
                                   reader.onloadend = () => {
                                       // 使用FileReader读取完成后，result属性将包含一个data URL
                                       // 这个URL可以被视频元素使用
                                       toolBoxStore.updateVideoTransformationCompAttr({
                                           src: reader.result
                                       });

                                       Utils.setElementDisabled('videoContainer', false)

                                   };
                                   // 读取文件内容
                                   reader.readAsDataURL(file);
                               }
                           }}/>
                </label>
                <div id={'srcVideoContainer'}
                    className={`skeleton flex-grow
                    ${toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' || toolBoxStore.videoTransformationCompAttr.src === null ? null : 'hidden'}`}/>


                <video

                    ref={videoRef}
                    src={toolBoxStore.videoTransformationCompAttr.src}
                    muted
                    controls

                    className={`object-contain ${(toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' && toolBoxStore.videoTransformationCompAttr.src !== null) ? null : 'hidden'}`}

                    onLoadedMetadata={e => {
                        toolBoxStore.updateVideoTransformationCompAttr({
                            duration: e.target.duration
                        });
                    }}

                    style={{
                        maxHeight:toolBoxStore.videoTransformationCompAttr.srcVideoContainerSize?.height,
                        maxWidth:toolBoxStore.videoTransformationCompAttr.srcVideoContainerSize?.width
                    }}

                />


            </div>


            <div className=" divider divider-horizontal h-full"/>


            <div id={'videoContainer'} className='h-full flex-grow flex flex-col'>
                <div
                    className={`${toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' ? 'hidden' : null}`}>
                    <label className="form-control  ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">Start time[{Utils.secondsToHMS(toolBoxStore.videoTransformationCompAttr.startTime)}]</span>
                        </div>
                        <input type="range" min={0} max={toolBoxStore.videoTransformationCompAttr.duration}
                               value={toolBoxStore.videoTransformationCompAttr.startTime}
                               className="range range-sm"
                               onChange={e => {
                                   toolBoxStore.updateVideoTransformationCompAttr({
                                       startTime: e.target.value
                                   });

                                   videoRef.current.currentTime = e.target.value


                               }}/>
                    </label>

                    <label className="form-control  ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">End time[{Utils.secondsToHMS(toolBoxStore.videoTransformationCompAttr.endTime)}]</span>
                        </div>
                        <input type="range" min={0} max={toolBoxStore.videoTransformationCompAttr.duration}
                               value={toolBoxStore.videoTransformationCompAttr.endTime}
                               className="range range-sm"
                               onChange={e => {
                                   toolBoxStore.updateVideoTransformationCompAttr({
                                       endTime: e.target.value
                                   });


                                   videoRef.current.currentTime = e.target.value

                               }}


                        />
                    </label>
                </div>
                <div className='flex-grow flex flex-col'>

                    <label className="form-control ">
                        <div className="label">
                            <span className="label-text font-bold text-2xl">Target Format</span>
                        </div>
                        <select className="select select-bordered w-full max-w-xs" onChange={e => {

                            toolBoxStore.updateVideoTransformationCompAttr({
                                targetFormat: e.target.value
                            });

                        }}>
                            <option value={'GIF'}>GIF</option>
                            <option value={'MP4'}>MP4</option>
                        </select>
                    </label>


                    <div className='flex items-center mt-3'>
                        <button className="btn btn-neutral mr-3 " onClick={async () => {

                            if (toolBoxStore.videoTransformationCompAttr.endTime === toolBoxStore.videoTransformationCompAttr.startTime
                                || toolBoxStore.videoTransformationCompAttr.endTime < toolBoxStore.videoTransformationCompAttr.startTime) {
                                alert('Start time must greater than start time')
                                return
                            }


                            if (toolBoxStore.videoTransformationCompAttr.ffmpeg === null) {
                                alert('Ffmpeg is null')
                                return
                            }


                            toolBoxStore.updateVideoTransformationCompAttr({
                                converting: true,
                                targetSrc: null,
                                progress:0
                            });


                            const inputFileName = `${toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' ? 'input.mp4' : 'input.avi'}`
                            const outputFileName = `output.${toolBoxStore.videoTransformationCompAttr.targetFormat.toLowerCase()}`

                            console.log(inputFileName, outputFileName)

                            // writing the video file to memory
                            await toolBoxStore.videoTransformationCompAttr.ffmpeg.writeFile(inputFileName, await fetchFile(toolBoxStore.videoTransformationCompAttr.src))

                            const startTime = toolBoxStore.videoTransformationCompAttr.startTime
                            const endTime = toolBoxStore.videoTransformationCompAttr.endTime

                            // cutting the video and converting it to GIF with a FFMpeg command
                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.exec(["-i", inputFileName, '-c:v', 'libx264', '-c:a', 'aac', outputFileName])
                            }


                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.exec(["-i", inputFileName, "-ss", `${startTime}`, "-to", `${endTime}`, outputFileName])
                            }

                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'GIF') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.exec(["-i", inputFileName, outputFileName])
                            }

                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'GIF') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.exec(["-i", inputFileName, "-ss", `${startTime}`, "-to", `${endTime}`, "-f", "gif", outputFileName])
                            }


                            // reading the resulting file
                            const data = await toolBoxStore.videoTransformationCompAttr.ffmpeg.readFile(outputFileName)


                            let targetUrl = null

                            // converting the GIF file created by FFmpeg to a valid image URL
                            if (toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4') {
                                targetUrl = URL.createObjectURL(new Blob([data.buffer], {type: "video/mp4"}))
                            } else {

                                targetUrl = URL.createObjectURL(new Blob([data.buffer], {type: "image/gif"}))
                            }

                            toolBoxStore.updateVideoTransformationCompAttr({
                                targetSrc: targetUrl,
                                converting: false
                            })


                            const res1 = await toolBoxStore.videoTransformationCompAttr.ffmpeg.deleteFile(inputFileName)
                            const res2 = await toolBoxStore.videoTransformationCompAttr.ffmpeg.deleteFile(outputFileName)

                        }}>Convert
                        </button>

                        {/*<button className='btn btn-neutral mr-3' onClick={async () => {*/}
                        {/*    if (toolBoxStore.videoTransformationCompAttr.ffmpeg !== null) {*/}
                        {/*        await toolBoxStore.videoTransformationCompAttr.ffmpeg.terminate()*/}
                        {/*    }*/}
                        {/*}}>Stop*/}
                        {/*</button>*/}


                        <button
                            className={`btn btn-neutral ${toolBoxStore.videoTransformationCompAttr.targetSrc === null ? 'hidden' : null}`}
                            onClick={() => {

                                const url = toolBoxStore.videoTransformationCompAttr.targetSrc

                                // 创建一个临时的 a 标签用于下载
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = Utils.formatTime(new Date());

                                // 触发下载
                                document.body.appendChild(a);
                                a.click();

                                // 清理
                                document.body.removeChild(a);
                            }}>Download

                        </button>


                        {toolBoxStore.videoTransformationCompAttr.converting ?
                            <div className="radial-progress"
                                 style={{"--value": toolBoxStore.videoTransformationCompAttr.progress ,"--size": "3rem", "--thickness": "4px" }}
                                 role="progressbar">{toolBoxStore.videoTransformationCompAttr.progress}%</div> : null}
                    </div>


                    <label className="form-control flex-grow flex flex-col">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">{toolBoxStore.videoTransformationCompAttr.targetFormat} Format Transformation Result</span>
                        </div>
                        {
                            toolBoxStore.videoTransformationCompAttr.targetSrc === null ?
                                <div id={'targetVideoContainer'} className="skeleton flex-grow"></div> : null
                        }

                        {
                            toolBoxStore.videoTransformationCompAttr.targetSrc !== null && toolBoxStore.videoTransformationCompAttr.targetFormat === 'GIF' ?

                                <img alt={''}
                                     src={toolBoxStore.videoTransformationCompAttr.targetSrc}
                                     className='object-contain'

                                     style={{
                                         maxHeight:toolBoxStore.videoTransformationCompAttr.targetVideoContainerSize?.height,
                                         maxWidth:toolBoxStore.videoTransformationCompAttr.targetVideoContainerSize?.width
                                     }}
                                /> : null

                        }


                        {
                            toolBoxStore.videoTransformationCompAttr.targetSrc !== null && toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4' ?
                                <video muted controls autoPlay
                                       src={toolBoxStore.videoTransformationCompAttr.targetSrc}
                                       className='object-contain'
                                       style={{
                                           maxHeight:toolBoxStore.videoTransformationCompAttr.targetVideoContainerSize?.height,
                                           maxWidth:toolBoxStore.videoTransformationCompAttr.targetVideoContainerSize?.width
                                       }}
                                /> : null

                        }
                    </label>


                </div>
            </div>


        </div>
    );
};

export default observer(VideoTransformationComp);