import React, {useEffect, useState} from 'react';
import {useStore} from "../../../../stores";
import {createWorker} from 'tesseract.js';
import {toBlobURL} from "@ffmpeg/util";
import Utils from "../../../../utils";
import _ from "lodash";
import {observer} from "mobx-react-lite";

const ImageRecognitionComp = () => {


    const [result, setResult] = useState(null)

    useEffect(() => {
        Utils.setElementDisabled('imageRecognitionCompAction', true)

    }, []);


    function getImageSize(url) {
        const img = new Image();
        img.onload = function () {

            toolBoxStore.updateImageRecognitionCompAttr({
                srcImageInternalSize: {
                    width: this.width,
                    height: this.height,
                    scale: toolBoxStore.imageRecognitionCompAttr.imageRecognitionCompImageElSize.width / this.width
                },

            });


            console.log(_.cloneDeep(toolBoxStore.imageRecognitionCompAttr), 'getImageSize')
            console.log(result, 'getImageSize')


        };
        img.src = url;
    }


    const {toolBoxStore} = useStore()
    return (
        <div className={`flex h-full w-full ${toolBoxStore.appOpen.imageRecognitionComp ? null : 'hidden'}`}>

            <div className='flex flex-col w-[60%] min-w-[60%] h-full '>


                <div className='flex flex-none '>

                    <label className="form-control flex-grow ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">Image File</span>
                        </div>

                        <input type="file"
                               accept="image/png, image/jpeg"
                               lang="en"
                               className={` file-input file-input-bordered`}
                               onChange={event => {


                                   const file = event.target.files[0];
                                   if (file) {

                                       toolBoxStore.updateImageRecognitionCompAttr({
                                           recognizing: false,
                                           progress: 0,
                                           srcImageUrl: null,
                                           result: null,
                                           srcImageInternalSize: null,
                                           imageRecognitionCompImageElSize: null
                                       });

                                       if (toolBoxStore.imageRecognitionCompAttr.imageContainerSize === null) {
                                           toolBoxStore.updateImageRecognitionCompAttr({
                                               imageContainerSize: Utils.getContainerSize('imageRecognitionCompImageContainer'),
                                           });
                                       }

                                       const reader = new FileReader();
                                       reader.onloadend = () => {
                                           // 使用FileReader读取完成后，result属性将包含一个data URL
                                           // 这个URL可以被视频元素使用
                                           toolBoxStore.updateImageRecognitionCompAttr({
                                               srcImageUrl: reader.result
                                           });

                                           Utils.setElementDisabled('imageRecognitionCompAction', false)

                                       };
                                       // 读取文件内容
                                       reader.readAsDataURL(file);

                                       console.log(_.cloneDeep(toolBoxStore.imageRecognitionCompAttr))

                                   }
                               }}/>

                    </label>

                    <label className="form-control w-[40%] ml-2 ">
                        <div className="label">
                            <span
                                className="label-text font-bold text-2xl">Language</span>
                        </div>

                        <select className="select select-bordered" onChange={e => {
                            toolBoxStore.updateImageRecognitionCompAttr(
                                {
                                    lang: e.target.value
                                }
                            )
                        }}>
                            <option value={'chi_sim'}>Chinese</option>
                            <option value={'eng'}>English</option>
                        </select>

                    </label>

                </div>


                <div id={'imageRecognitionCompImageContainer'}
                     className={`${toolBoxStore.imageRecognitionCompAttr.srcImageUrl === null ? null : 'hidden'} skeleton flex-grow w-full mt-4`}/>

                <img

                    id='imageRecognitionCompImageEl'
                    src={toolBoxStore.imageRecognitionCompAttr.srcImageUrl}
                    className={`mt-4 object-contain ${toolBoxStore.imageRecognitionCompAttr.srcImageUrl !== null ? null : 'hidden'}`}

                    style={{
                        maxHeight: toolBoxStore.imageRecognitionCompAttr.imageContainerSize?.height,
                        maxWidth: toolBoxStore.imageRecognitionCompAttr.imageContainerSize?.width
                    }}
                    alt={''}
                />


                <div
                    className={`${result !== null ? 'border border-blue-500' : 'hidden'} fixed`}
                    style={{
                        width: toolBoxStore.imageRecognitionCompAttr.imageRecognitionCompImageElSize?.width,
                        height: toolBoxStore.imageRecognitionCompAttr.imageRecognitionCompImageElSize?.height,
                        top: toolBoxStore.imageRecognitionCompAttr.imageRecognitionCompImageElSize?.top,
                        left: toolBoxStore.imageRecognitionCompAttr.imageRecognitionCompImageElSize?.left,
                    }}
                >

                    {/*{toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize!==null?result?.lines.map(item1 => item1.words.map(item2 => <div*/}
                    {/*    className='border border-yellow-500 absolute' style={{*/}
                    {/*    left: item2.bbox.x0 * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale ,*/}
                    {/*    top: item2.bbox.y0 * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}
                    {/*    width: (item2.bbox.x1 - item2.bbox.x0) * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}
                    {/*    height: (item2.bbox.y1 - item2.bbox.y0) * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}
                    {/*    fontSize:item2.font_size*toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}
                    {/*    // lineHeight:*/}

                    {/*}}>*/}
                    {/*    {item2.text}*/}
                    {/*</div>)):null}*/}


                    {/*{toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize!==null?result?.lines.map(item1  => <div*/}
                    {/*    className='border border-yellow-500 absolute text-transparent' style={{*/}
                    {/*    left: item1.bbox.x0 * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale ,*/}
                    {/*    top: item1.bbox.y0 * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}
                    {/*    width: (item1.bbox.x1 - item1.bbox.x0) * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}
                    {/*    height: (item1.bbox.y1 - item1.bbox.y0) * toolBoxStore.imageRecognitionCompAttr.srcImageInternalSize.scale,*/}

                    {/*}}>*/}
                    {/*    {item1.text}*/}
                    {/*</div>):null}*/}


                </div>


            </div>


            <div className=" divider divider-horizontal h-full"/>


            <div id={'imageRecognitionCompAction'} className='flex-grow  h-full flex flex-col'>

                <div className='flex-none'>
                    <button className='btn btn-neutral' onClick={async () => {

                        toolBoxStore.updateImageRecognitionCompAttr({
                            recognizing: true
                        });

                        const baseURL = 'http://127.0.0.1:8082/assets/tesseract';

                        // console.log(_.cloneDeep(toolBoxStore.imageRecognitionCompAttr), 'toolBoxStore.imageRecognitionCompAttr')

                        const worker = await createWorker(toolBoxStore.imageRecognitionCompAttr.lang, 1, {
                            // workerPath: "./node_modules/tesseract.js/dist/worker.min.js",
                            workerPath: await toBlobURL(`${baseURL}/worker.min.js`, 'text/javascript'),
                            // corePath 在worker.min.js源码中写死了
                            // corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0',
                            langPath: `${baseURL}/lang`,

                            logger: m => {

                                if (m.status === 'recognizing text') {
                                    toolBoxStore.updateImageRecognitionCompAttr({
                                        progress: (m.progress * 100).toFixed(0)
                                    });


                                    if (m.progress === 1) {
                                        toolBoxStore.updateImageRecognitionCompAttr({
                                            recognizing: false
                                        });
                                    }

                                }

                            }, // Add logger here
                        });
                        const ret = await worker.recognize(toolBoxStore.imageRecognitionCompAttr.srcImageUrl);
                        await worker.terminate();
                        console.log(ret);
                        setResult(ret.data)

                        toolBoxStore.updateImageRecognitionCompAttr({
                            imageRecognitionCompImageElSize: Utils.getContainerSize('imageRecognitionCompImageEl'),
                            // result:ret.data
                        });

                        getImageSize(toolBoxStore.imageRecognitionCompAttr.srcImageUrl)


                    }}>Recognize
                    </button>

                    <div
                        className={`radial-progress ml-6 ${toolBoxStore.imageRecognitionCompAttr.recognizing ? null : 'hidden'}`}
                        style={{
                            "--value": toolBoxStore.imageRecognitionCompAttr.progress,
                            "--size": "3rem",
                            "--thickness": "4px"
                        }}
                        role="progressbar">{toolBoxStore.imageRecognitionCompAttr.progress}%
                    </div>

                </div>


                <div className='flex-grow'>
                    <label className="h-[100%] form-control  flex  flex-col ">
                        <div className="label flex-none flex ">
                            <span
                                className="label-text font-bold text-2xl">Recognition Result</span>

                            {/*<div className='flex-none flex '>*/}
                            {/*    <button className='btn btn-neutral mr-2'>Copy</button>*/}
                            {/*    <button className='btn btn-neutral'>Clear</button>*/}

                            {/*</div>*/}
                        </div>

                        <div
                            className='whitespace-pre-wrap bg-black rounded-2xl flex-grow basis-0 overflow-y-scroll text-white font-bold text-2xl p-3'>
                            {result?.text}
                        </div>

                    </label>
                </div>


            </div>


        </div>
    );
};

export default observer(ImageRecognitionComp);
