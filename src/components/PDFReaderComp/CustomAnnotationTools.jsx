import {RxDividerVertical as VerticalIcon} from "react-icons/rx";
import {FaRegFolderOpen as OpenFileIcon} from "react-icons/fa";
import {CiRead as ReadIcon} from "react-icons/ci";
import {TbPencilExclamation as PencilIcon} from "react-icons/tb";
import {BiText as TextIcon} from "react-icons/bi";
import {MdDelete as DeleteIcon, MdFormatListNumberedRtl as ListIcon} from "react-icons/md";

import {HiAnnotation as AnnotationIcon} from "react-icons/hi";
import Swal from "sweetalert2";
import _ from "lodash";
import {createRoot} from "react-dom/client";
import Utils from "../../utils";
import PdfReaderComp from "./PDFReaderComp";
import React, {useEffect} from "react";
import {useStore} from "../../stores";
import {observer} from "mobx-react-lite";
import AnnotationIconContainer from "./AnnotationIconContainer";
import usePDFReaderCompHooks from "./usePDFReaderCompHooks";
import {useCommonHooks} from "../useCommonHooks";
import { IoMdCodeDownload as  DownloadIcon} from "react-icons/io";

const CustomAnnotationTools = () => {
    const {commonStore} = useStore()
    const {saveData} = useCommonHooks()

    const {displayPDFFile, renderCanvas, setElAttr} = usePDFReaderCompHooks()

    return <div className={'JpTw-flex JpTw-items-center '}>
        <div id={'JpAnnotationConfig'} style={{display: "flex"}}>
            <input type="color" style={{marginRight: '1rem'}} id={'JpColorPicker'} defaultValue={'#FF0000'}/>
        </div>

        <VerticalIcon size={'1.25rem'} style={{marginRight: '1rem'}} id={'JpAnnotationConfigDivider'}/>


        <AnnotationIconContainer id={'OpenFileIconContainer'} title={'Open PDF'} onClickFunc={() => {

            const JpOpenPDFFileEl = commonStore.annotationIconConfig.iframeDocument.querySelector('#JpOpenPDFFile')
            JpOpenPDFFileEl.click()


        }} joinButtonGroup={false}>
            <OpenFileIcon size={'1.25rem'}
            />

            <input accept="application/pdf" type="file" id="JpOpenPDFFile" style={{display: "none"}}
                   onChange={async e => {
                       if (e.target.files.length === 0) return
                       const file = e.target.files[0];
                       const blobUrl = URL.createObjectURL(file);

                       const reader = new FileReader();
                       reader.onload = async function (event) {
                           const base64String = event.target.result;
                           commonStore.updateAnnotationIconConfig({
                               pdfAssets: {
                                   id: null,
                                   value: {
                                       name: file.name,
                                       url: base64String
                                   }
                               }
                           })


                           await displayPDFFile(commonStore.annotationIconConfig.pdfAssets[commonStore.annotationIconConfig.pdfAssets.length - 1])


                       };
                       reader.readAsDataURL(file); // 将文件读取为 Data URL

                   }}/>
        </AnnotationIconContainer>


        <AnnotationIconContainer
            id={'ReadIconContainer'}
            title={'Only Read'}
            initFunc={() => {
                setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                    (el) => {
                        el.style.display = 'none'
                    },

                    (el) => {
                        el.style.display = 'none'
                    },
                ])
            }}
            onClickFunc={() => {
                commonStore.updateAnnotationZIndex()
                setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                    (el) => {
                        el.style.display = 'none'
                    },
                    (el) => {
                        el.style.display = 'none'
                    },
                ])

            }}>
            <ReadIcon size={'1.25rem'}
            />
        </AnnotationIconContainer>


        <AnnotationIconContainer id={'PencilIconContainer'} title={'Annotation Pencil'} onClickFunc={() => {

            renderCanvas(1)
            renderCanvas(commonStore.annotationIconConfig.currentPageNum)
            setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                (el) => {
                    el.style.display = 'block'
                },
                (el) => {
                    el.style.display = 'block'
                },
            ])


        }}>
            <PencilIcon size={'1.25rem'}
            />
        </AnnotationIconContainer>


        <AnnotationIconContainer id={'TextIconContainer'} title={'Annotation Text'} onClickFunc={() => {
            renderCanvas(1)
            renderCanvas(commonStore.annotationIconConfig.currentPageNum)
            setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                (el) => {
                    el.style.display = 'block'
                },

                (el) => {
                    el.style.display = 'block'
                }
            ])
        }}>
            <TextIcon size={'1.25rem'}
            />
        </AnnotationIconContainer>


        <AnnotationIconContainer
            id={'ListIconContainer'}
            title={'PDF List'}
            onClickFunc={() => {

            }}
            joinButtonGroup={false}
        >
            <ListIcon size={'1.25rem'} onClick={async (event) => {
                if (commonStore.annotationIconConfig.pdfAssets.length === 0) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "No PDF Exist"
                    });
                    return
                }

                const JpPdfListEl = commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList')
                commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList').innerHTML = ''

                commonStore.annotationIconConfig.pdfAssets.forEach(item => {
                    const newElement = document.createElement('div');
                    newElement.id = item.id
                    newElement.style = 'margin-bottom: 5px; cursor: pointer;'
                    newElement.classList.add('JpTw-bg-enter')
                    if (commonStore.annotationIconConfig.currentOpenPDF !== null && item.id === commonStore.annotationIconConfig.currentOpenPDF.id) {
                        newElement.classList.add('JpTw-bg-active')
                    }
                    const root = createRoot(newElement);
                    root.render(<div
                        style={{
                            padding: '0.5rem'
                        }}
                        onClick={async (event) => {
                            await displayPDFFile(item)
                        }}
                        key={item.id}
                        title={Utils.getAbbreviateStr(item.name).tooltip === null ? null : Utils.getAbbreviateStr(item.name).tooltip}
                    >
                        {Utils.getAbbreviateStr(item.name).text}
                    </div>);

                    // 使用appendChild将这个新的div添加到容器中
                    commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList').appendChild(newElement);
                })

                if (JpPdfListEl.style.display === 'flex') {
                    JpPdfListEl.style.display = 'none'
                } else if (JpPdfListEl.style.display === 'none') {
                    JpPdfListEl.style.display = 'flex'
                }


            }}/>
            <div id={'JpPdfList'}
                 key={commonStore.testVars.length}
                 style={{
                     position: "absolute",
                     top: "100%",
                     right: '100%',
                     display: "none",
                     flexDirection: "column",
                     backgroundColor: 'white',
                     zIndex: 50,
                     width: '15rem',
                     padding: '0.5rem',
                     borderRadius: '1rem',
                     maxHeight: '30rem',
                     overflowY: "auto"
                 }}
            >


            </div>
        </AnnotationIconContainer>


        <AnnotationIconContainer
            id={'AnnotationsIconContainer'}
            title={'Annotations List'}
            onClickFunc={() => {

            }}
            joinButtonGroup={false}
        >
            <AnnotationIcon size={'1.25rem'} onClick={async (event) => {
                const id = commonStore.annotationIconConfig.currentOpenPDF?.id

                if (!id) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "Not PDF Opened"
                    });
                    return
                }

                const currentHistory = commonStore.annotationIconConfig.history[id]


                if (!currentHistory) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "No Annotation Exist"
                    });
                    return
                }


                const annotations = Object.keys(currentHistory)


                if (annotations.length === 0) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "No Annotation Exist"
                    });
                    return
                }

                const JpAnnotationsListEl = commonStore.annotationIconConfig.iframeDocument.getElementById('JpAnnotationsList')
                commonStore.annotationIconConfig.iframeDocument.getElementById('JpAnnotationsList').innerHTML = ''

                annotations.filter(i=>currentHistory[i]['canvasObjectData']['objects'].length!==0).forEach(item => {
                    const newElement = document.createElement('div');
                    newElement.id = item

                    newElement.style = 'margin-bottom: 5px;     cursor: pointer;'
                    newElement.classList.add('JpTw-bg-enter')

                    const root = createRoot(newElement);
                    root.render(<div
                        style={{
                            padding: '0.5rem'
                        }}
                        onClick={async (event) => {

                            commonStore.annotationIconConfig.viewerApp.pdfViewer.currentPageNumber = parseInt(item);

                        }}
                        key={item}
                    >

                        {`${currentHistory[item]['canvasObjectData']['objects'].length} annotations on the ${item} page`}
                    </div>);

                    // 使用appendChild将这个新的div添加到容器中
                    commonStore.annotationIconConfig.iframeDocument.getElementById('JpAnnotationsList').appendChild(newElement);
                })

                if (JpAnnotationsListEl.style.display === 'flex') {
                    JpAnnotationsListEl.style.display = 'none'
                } else if (JpAnnotationsListEl.style.display === 'none') {
                    JpAnnotationsListEl.style.display = 'flex'
                }


            }}/>
            <div id={'JpAnnotationsList'}
                 key={commonStore.testVars.length}
                 style={{
                     position: "absolute",
                     top: "100%",
                     right: '100%',
                     display: "none",
                     flexDirection: "column",
                     backgroundColor: 'white',
                     zIndex: 50,
                     width: '18rem',
                     padding: '0.5rem',
                     borderRadius: '1rem',
                     maxHeight: '30rem',
                     overflowY: "auto"
                 }}
            >


            </div>
        </AnnotationIconContainer>


        <AnnotationIconContainer id={'DeleteIconContainer'} title={'Delete Current PDF'} joinButtonGroup={false}
                                 onClickFunc={() => {

                                 }}>
            <DeleteIcon size={'1.25rem'}

                        onClick={async () => {
                            if (commonStore.annotationIconConfig.currentOpenPDF === null) {
                                await Swal.fire({
                                    icon: "warning",
                                    title: `Please open a  pdf!`,
                                });

                                return
                            }

                            const result = await Swal.fire({
                                html: `${commonStore.annotationIconConfig.currentOpenPDF.name}`,
                                title: 'Delete PDF',
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: 'Confirm',
                                cancelButtonText: 'Cancel',
                            })
                            if (result.isConfirmed) {
                                Utils.removeElementById(commonStore.annotationIconConfig.currentOpenPDF.id, commonStore.annotationIconConfig.iframeDocument)


                                commonStore.updateAnnotationIconConfig({
                                    pdfAssets: {
                                        id: commonStore.annotationIconConfig.currentOpenPDF.id,
                                        value: null
                                    }
                                })


                                commonStore.updateAnnotationIconConfig({
                                    currentOpenPDF: null
                                })

                                await saveData('Delete data success')


                                const PDFReaderContainer = createRoot(document.getElementById('PDFReaderContainer'))
                                PDFReaderContainer.render(<PdfReaderComp/>)


                            }


                        }}
            />
        </AnnotationIconContainer>



        <AnnotationIconContainer id={'DownloadPDFIconContainer'} title={'Download Current PDF'} joinButtonGroup={false}  isChecked={false}
                                 onClickFunc={() => {

                                 }}>
            <DownloadIcon size={'1.25rem'}

                        onClick={async () => {
                            if (commonStore.annotationIconConfig.currentOpenPDF === null) {
                                await Swal.fire({
                                    icon: "warning",
                                    title: `Please open a  pdf!`,
                                });

                                return
                            }



                            function downloadFile(url, filename) {
                                // 创建一个<a>元素
                                const a = document.createElement('a');

                                // 设置<a>元素的href属性为下载文件的URL
                                a.href = url;

                                // 设置下载文件的名称
                                a.download = filename;

                                // 将<a>元素添加到DOM中
                                document.body.appendChild(a);

                                // 模拟点击<a>元素以触发下载
                                a.click();

                                // 下载后移除<a>元素
                                document.body.removeChild(a);
                            }


                           const item = commonStore.annotationIconConfig.pdfAssets.find(item=>item.id===commonStore.annotationIconConfig.currentOpenPDF.id)
                            if(item===undefined)return

                            downloadFile(item.url, item.name);



                        }}
            />
        </AnnotationIconContainer>


    </div>
}

export default observer(CustomAnnotationTools)
