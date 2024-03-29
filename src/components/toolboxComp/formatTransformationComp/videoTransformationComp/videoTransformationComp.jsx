import React, {useEffect, useRef} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../../../stores";
import _ from 'lodash'
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
import Utils from "../../../../utils";

const VideoTransformationComp = () => {
    const {toolBoxStore, commonStore} = useStore()


    const videoRef = useRef(null)


    useEffect(() => {
        const baseURL = 'http://localhost:8080/assets/ffmpeg';

        const ffmpeg = createFFmpeg({
            log: true,
            corePath: `${baseURL}/ffmpeg-core.js`,
            workerPath: `${baseURL}/ffmpeg-core.worker.js`,
            wasmPath: `${baseURL}/ffmpeg-core.wasm`,

        })


        // loading ffmpeg on startup
        ffmpeg.load().then(() => {
            toolBoxStore.updateVideoTransformationCompAttr({
                ffmpeg: ffmpeg
            })
        })


    }, []);

    return (
        <div className={`flex h-full p-6 ${toolBoxStore.appOpen.videoTransformationComp ? null : 'hidden'}`}>

            <div>
                <label className="form-control w-[32rem] ">
                    <div className="label">
                        <span className="label-text font-bold text-2xl">Upload a video</span>
                    </div>
                    <input type="file" className="mb-3 file-input file-input-bordered w-[32rem]"
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


                                   const reader = new FileReader();
                                   reader.onloadend = () => {
                                       // 使用FileReader读取完成后，result属性将包含一个data URL
                                       // 这个URL可以被视频元素使用
                                       toolBoxStore.updateVideoTransformationCompAttr({
                                           src: reader.result
                                       });
                                   };
                                   // 读取文件内容
                                   reader.readAsDataURL(file);
                               }
                           }}/>
                </label>


                <div
                    className={`skeleton w-[48rem] h-[32rem] 
                    ${toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' || toolBoxStore.videoTransformationCompAttr.src === null ? null : 'hidden'}`}/>


                <video
                    ref={videoRef}
                    src={toolBoxStore.videoTransformationCompAttr.src}
                    muted
                    controls

                    className={`w-[48rem] max-w-[64rem] max-h-[48rem] ${(toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' && toolBoxStore.videoTransformationCompAttr.src !== null) ? null : 'hidden'}`}

                    onLoadedMetadata={e => {
                        toolBoxStore.updateVideoTransformationCompAttr({
                            duration: e.target.duration
                        });
                    }}


                />


            </div>


            <div className="divider divider-horizontal h-full"/>


            <div className='mb-4'>
                <div className={`${toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi'?'hidden':null}`}>
                    <label className="form-control w-[32rem] ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">Start time[{commonStore.secondsToHMS(toolBoxStore.videoTransformationCompAttr.startTime)}]</span>
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

                    <label className="form-control w-[32rem] ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">End time[{commonStore.secondsToHMS(toolBoxStore.videoTransformationCompAttr.endTime)}]</span>
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

                <div className=''>

                    <label className="form-control w-[32rem] mb-2 ">
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


                    <div className='flex '>
                        <button className="btn btn-neutral mr-3" onClick={async () => {

                            if (toolBoxStore.videoTransformationCompAttr.endTime < toolBoxStore.videoTransformationCompAttr.startTime) {
                                alert('Start time must greater than start time')
                                return
                            }


                            if (toolBoxStore.videoTransformationCompAttr.ffmpeg === null) {
                                alert('Ffmpeg is null')
                                return
                            }


                            toolBoxStore.updateVideoTransformationCompAttr({
                                converting: true
                            });


                            const inputFileName = toolBoxStore.videoTransformationCompAttr.srcName
                            const outputFileName = `output.${toolBoxStore.videoTransformationCompAttr.targetFormat.toLowerCase()}`

                            // writing the video file to memory
                            toolBoxStore.videoTransformationCompAttr.ffmpeg.FS("writeFile", inputFileName, await fetchFile(toolBoxStore.videoTransformationCompAttr.src))

                            const startTime = toolBoxStore.videoTransformationCompAttr.startTime
                            const endTime = toolBoxStore.videoTransformationCompAttr.endTime

                            // cutting the video and converting it to GIF with a FFMpeg command
                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.run("-i", inputFileName, '-c:v', 'libx264', '-c:a', 'aac', outputFileName)
                            }


                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.run("-i", inputFileName, "-ss", `${startTime}`, "-to", `${endTime}`, outputFileName)
                            }

                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/avi' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'GIF') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.run("-i", inputFileName, outputFileName)
                            }

                            if (toolBoxStore.videoTransformationCompAttr.srcType === 'video/mp4' && toolBoxStore.videoTransformationCompAttr.targetFormat === 'GIF') {
                                await toolBoxStore.videoTransformationCompAttr.ffmpeg.run("-i", inputFileName, "-ss", `${startTime}`, "-to", `${endTime}`, "-f", "gif", outputFileName)
                            }


                            // reading the resulting file
                            const data = toolBoxStore.videoTransformationCompAttr.ffmpeg.FS("readFile", outputFileName)


                            let targetUrl = null

                            // converting the GIF file created by FFmpeg to a valid image URL
                            if (toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4') {
                                targetUrl = URL.createObjectURL(new Blob([data.buffer], {type: "video/mp4"}))
                            } else {

                                targetUrl = URL.createObjectURL(new Blob([data.buffer], {type: "image/gif"}))
                            }

                            toolBoxStore.updateVideoTransformationCompAttr({
                                targetSrc: targetUrl
                            });


                            toolBoxStore.updateVideoTransformationCompAttr({
                                converting: false
                            });


                        }}>Convert
                        </button>


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
                            <span className="loading loading-bars loading-md"/> : null}
                    </div>


                    <label className="form-control w-[32rem] mb-2 ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">{toolBoxStore.videoTransformationCompAttr.targetFormat} Format Transformation Result</span>
                        </div>
                        {
                            toolBoxStore.videoTransformationCompAttr.targetSrc === null ?
                                <div className="skeleton w-[32rem] h-[24rem]"></div> : null
                        }

                        {
                            toolBoxStore.videoTransformationCompAttr.targetSrc !== null && toolBoxStore.videoTransformationCompAttr.targetFormat === 'GIF' ?

                                <img alt={''}
                                     src={toolBoxStore.videoTransformationCompAttr.targetSrc}
                                     className='w-[32rem] max-w-[32rem] max-h-[24rem]'
                                /> : null

                        }


                        {
                            toolBoxStore.videoTransformationCompAttr.targetSrc !== null && toolBoxStore.videoTransformationCompAttr.targetFormat === 'MP4' ?
                                <video muted controls autoPlay
                                       src={toolBoxStore.videoTransformationCompAttr.targetSrc}
                                       className='w-[32rem] max-w-[32rem] max-h-[24rem]'
                                /> : null

                        }
                    </label>


                </div>

            </div>


        </div>
    );
};

export default observer(VideoTransformationComp);