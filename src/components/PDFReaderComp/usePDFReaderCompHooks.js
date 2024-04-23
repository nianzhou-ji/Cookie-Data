import {fabric} from "fabric";
import {useStore} from "../../stores";
import _ from "lodash";
import {RxDividerVertical as VerticalIcon} from "react-icons/rx";
import {CiRead as ReadIcon} from "react-icons/ci";
import {TbPencilExclamation as PencilIcon} from "react-icons/tb";
import {BiText as TextIcon} from "react-icons/bi";
import {createRoot} from "react-dom/client";
import {MdFormatListNumberedRtl as ListIcon} from "react-icons/md";
import {FaRegFolderOpen as OpenFileIcon} from "react-icons/fa";
import Utils from "../../utils";
import React, {useEffect} from "react";
import {MdDelete as DeleteIcon} from "react-icons/md";
import Swal from "sweetalert2";
import PdfReaderComp from "./PDFReaderComp";

const baseURL = 'http://localhost:8082/assets';

const usePDFReaderCompHooks = () => {

    const {commonStore} = useStore()

    const renderCanvas = (pageNumber) => {
        if (commonStore.annotationIconConfig.currentOpenPDF === null) {
            console.log('commonStore.annotationIconConfig.currentOpenPDF===null')
            return
        }
        ;
        const canvasAnnotationElItem = commonStore.annotationIconConfig.canvasAnnotationElGroup[commonStore.annotationIconConfig.currentOpenPDF.id]
        if (canvasAnnotationElItem === undefined) {
            console.log('canvasAnnotationElItem===undefined')
            return
        }
        const values = canvasAnnotationElItem[pageNumber]
        if (commonStore.annotationIconConfig.clicked['PencilIconContainer']) {
            createFabricCanvas(values, annotationPencilCanvasConfigFunc)
            commonStore.updateAnnotationIconConfig({
                canvasAnnotationElGroup: {
                    pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                    pageNum: `${pageNumber}`,
                    value: values
                }
            })

            // console.log('PencilIconContainer render')

        }


        if (commonStore.annotationIconConfig.clicked['TextIconContainer']) {
            createFabricCanvas(values, annotationTextCanvasConfigFunc)
            commonStore.updateAnnotationIconConfig({
                canvasAnnotationElGroup: {
                    pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                    key: `${pageNumber}`,
                    value: values
                }
            })

            console.log('TextIconContainer render')

        }
    }

    const discardActiveObject = () => {
        if (commonStore.annotationIconConfig.currentOpenPDF === null) return
        Object.keys(commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id]).forEach(key => {
            const canvas = commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id][key]
            canvas.discardActiveObject()
            canvas.renderAll()
        })
    }


    const refreshPDFMessage = (name, currentPageNum, pageCounts, rootContainer) => {
        // const root1 = createRoot(commonStore.annotationIconConfig.iframeDocument.getElementById('JpDocumentMessage'))
        rootContainer.render(
            <>
                <div id={'JpPDFName'} style={{fontWeight: "bold", marginRight: '2rem'}}>{name}</div>
                <div id={'JpPDFPageMessage'} style={{fontWeight: "bold"}}>{currentPageNum}/{pageCounts} Page</div>
            </>)
    }


    const setElAttr = (idGroup, funcGroup) => {

        idGroup.forEach((id, index) => {
            const el = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
            if (el !== null) {
                funcGroup[index](el)
            }

        })
    }

    const annotationPencilCanvasConfigFunc = (canvas) => {
        // 初始化自由绘图模式参数
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value;
        canvas.freeDrawingBrush.width = 3;


        setElAttr(['JpColorPicker'], [
            (el) => {
                el.addEventListener('change', (e) => {
                    canvas.freeDrawingBrush.color = e.target.value
                })
            }
        ])


    }


    const loadHistory = (pageNum) => {
        if (commonStore.annotationIconConfig.currentOpenPDF === null) return
        if (commonStore.annotationIconConfig.history[commonStore.annotationIconConfig.currentOpenPDF.id] === undefined) return
        const canvas = commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
        const history = commonStore.annotationIconConfig.history[commonStore.annotationIconConfig.currentOpenPDF.id]
        if (history[pageNum] !== undefined) {
            const currentCanvasBoundingClientRect = commonStore.annotationIconConfig.canvasBoundingClientRect[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
            const scaleWidth = currentCanvasBoundingClientRect.width / history[pageNum]['canvasSizeData'].width;
            const scaleHeight = currentCanvasBoundingClientRect.height / history[pageNum]['canvasSizeData'].height;
            history[pageNum]['canvasObjectData']?.objects.forEach(object => {
                object.width = object.width * scaleWidth;
                object.height = object.height * scaleHeight;
                object.left = object.left * scaleWidth;
                object.top = object.top * scaleHeight;

                if (object.type === 'path') {
                    object.path.forEach(item2 => {
                        if (item2[0] === 'M') {
                            item2[1] = item2[1] * scaleWidth
                            item2[2] = item2[2] * scaleHeight
                        } else if (item2[0] === 'Q') {
                            item2[1] = item2[1] * scaleWidth
                            item2[2] = item2[2] * scaleHeight
                            item2[3] = item2[3] * scaleWidth
                            item2[4] = item2[4] * scaleHeight

                        } else if (item2[0] === 'L') {
                            item2[1] = item2[1] * scaleWidth
                            item2[2] = item2[2] * scaleHeight
                        }
                    })
                }


                if (object.type === 'textbox') {
                    object.scaleY = object.scaleY * scaleHeight
                    object.scaleX = object.scaleX * scaleWidth
                }


            })

            canvas.loadFromJSON(history[pageNum]['canvasObjectData'], function () {
                canvas.requestRenderAll();  // 确保画布更新显示
                // console.log('load history success')


            });


        }


    }


    const saveHistory = (pageNum) => {
        if (commonStore.annotationIconConfig.currentOpenPDF === null) return
        if (commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id] === undefined) return
        const canvas = commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
        commonStore.updateAnnotationIconConfig({
            history: {
                pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                pageNum: pageNum,
                value: {
                    canvasObjectData: canvas.toJSON(),
                    canvasSizeData: commonStore.annotationIconConfig.canvasBoundingClientRect[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum],
                },
            }
        })

    }

    const annotationTextCanvasConfigFunc = (canvas) => {
        canvas.on('selection:created', () => {
            // console.log('selection:created')
            commonStore.updateAnnotationIconConfig({
                canvasObjSelectionState: true
            })
        })

        canvas.on('selection:updated', () => {
            // console.log('selection:updated ')
            commonStore.updateAnnotationIconConfig({
                canvasObjSelectionState: true
            })
        })


        canvas.on('selection:cleared', () => {
            // console.log('selection:cleared  ')
            commonStore.updateAnnotationIconConfig({
                canvasObjSelectionState: false
            })
        })

        // 监听鼠标按下事件
        canvas.on('mouse:down', function (o) {
            if (commonStore.annotationIconConfig.canvasObjSelectionState) return
            const pointer = canvas.getPointer(o.e);
            const textbox = new fabric.Textbox('Text', {
                left: pointer.x,
                top: pointer.y,
                fill: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value,
                strokeWidth: 1,
                stroke: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value,
            });

            // console.log('mouse:down', 'annotationTextCanvasConfigFunc')


            setElAttr(['JpColorPicker'], [
                (el) => {
                    el.addEventListener('change', (e) => {
                        textbox.fill = e.target.value
                        textbox.stroke = e.target.value
                    })
                },


            ])

            canvas.add(textbox);
            canvas.renderAll();


        });


    }


    const createFabricCanvas = (values, canvasConfigFunc = canvas => {
    }) => {
        const canvas = new fabric.Canvas(values.canvasAnnotationEl, {
            containerClass: 'JpCanvasAnnotationWrapper',
            width: values.pageDivElSize.width,
            height: values.pageDivElSize.height
        });

        const wrapperEl = values.pageDivEl.querySelector('.JpCanvasAnnotationWrapper')
        if (wrapperEl === null) return
        wrapperEl.style.zIndex = '1'
        wrapperEl.style.top = `0`
        wrapperEl.style.left = `0`
        wrapperEl.style.position = 'absolute'
        canvasConfigFunc(canvas)


        commonStore.updateAnnotationZIndex()
        commonStore.updateAnnotationIconConfig({
            fabricCanvas: {
                pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                key: `${values.pageNum}`,
                value: canvas
            }
        })


        const changeEvents = [
            'object:modified',
            'object:moving',
            'object:added',
            'object:scaling',
            'object:rotating',
            'object:skewing',
        ]

        changeEvents.forEach(item => {
            canvas.on(item, function (event) {
                saveHistory(values.pageNum)
                // console.log(item, _.cloneDeep(commonStore.annotationIconConfig.history))
            });

        })


        // 添加键盘事件监听
        commonStore.annotationIconConfig.iframeDocument.addEventListener('keydown', function (event) {
            // 检查是否按下了 'delete' 键
            if (event.key === 'Delete') {
                const activeObject = canvas.getActiveObject();
                if (activeObject) {
                    // 删除当前选中的对象
                    canvas.remove(activeObject);
                    canvas.requestRenderAll();  // 确保画布更新显示
                }
            }

            if (event.key === 'Escape') {
                const activeObject = canvas.getActiveObject();
                if (activeObject) {
                    // 删除当前选中的对象
                    canvas.discardActiveObject(activeObject);
                    canvas.requestRenderAll();  // 确保画布更新显示
                }
            }

        });


        loadHistory(values.pageNum)

        canvas.requestRenderAll();  // 确保画布更新显示


        return canvas
    }


    const AnnotationIconContainer = (
        {
            children, id, title,
            initFunc = () => {
            },
            onClickFunc = () => {
            },
            joinButtonGroup = true
        }) => {

        useEffect(() => {

            commonStore.updateAnnotationIconConfig({
                clicked: {
                    id: id,
                    value: false
                }
            })


            initFunc()
        }, []);


        return <div id={id} title={title}
                    style={{
                        marginRight: '0.5rem',
                        width: '1.5rem',
                        height: '1.5rem',
                        position: "relative"

                    }}
                    className={`JpTw-flex JpTw-items-center JpTw-justify-center JpTw-bg-enter`}
                    onClick={e => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)

                        Object.keys(commonStore.annotationIconConfig.clicked).forEach(item => {
                            if (item === id) {
                                commonStore.updateAnnotationIconConfig({
                                    clicked: {
                                        id: id,
                                        value: !commonStore.annotationIconConfig.clicked[id]
                                    }
                                })
                            } else if (item !== id && joinButtonGroup) {
                                commonStore.updateAnnotationIconConfig({
                                    clicked: {
                                        id: item,
                                        value: false
                                    }
                                })

                                const otherAnnotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(item)
                                otherAnnotationIconContainer?.classList?.toggle("JpTw-bg-active", false)
                            }
                        })


                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-active", true)
                        } else {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-active", false)
                        }


                        onClickFunc()


                    }}
                    onMouseEnter={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-enter", false)
                        }
                    }}
                    onMouseLeave={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-enter", true)
                        }

                    }}
        >
            {children}
        </div>
    }


    const displayPDFFile = async (pdfItem) => {
        const JpPdfListEl = commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList')
        await commonStore.annotationIconConfig.viewerApp.open({data: await Utils.urlToUint8Array(pdfItem.url)})
        commonStore.updateAnnotationIconConfig({
            currentOpenPDF: pdfItem
        })
        refreshPDFMessage(
            commonStore.annotationIconConfig.currentOpenPDF.name,
            1,
            commonStore.annotationIconConfig.pagesCount,
            commonStore.annotationIconConfig.JpDocumentMessageRoot
        )

        commonStore.annotationIconConfig.pdfAssets.forEach(itemInner => {
            if (commonStore.annotationIconConfig.currentOpenPDF === null) return
            if (commonStore.annotationIconConfig.currentOpenPDF.id === itemInner.id) {

                JpPdfListEl.querySelector(`#${itemInner.id}`)?.classList.toggle('JpTw-bg-active', true)
            } else {
                JpPdfListEl.querySelector(`#${itemInner.id}`)?.classList.toggle('JpTw-bg-active', false)
            }
        })

        JpPdfListEl.style.display = 'none'
    }


    const CustomAnnotationTools = () => {

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

                               // console.log(base64String, 'base64String'); // 打印 Base64 编码的字符串


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
                    console.log(_.cloneDeep(commonStore.annotationIconConfig.pdfAssets), 'ListIcon')
                    JpPdfListEl.querySelector('#JpListContainer').innerHTML = ''
                    commonStore.annotationIconConfig.pdfAssets.forEach(item => {
                        const newElement = document.createElement('div');
                        newElement.id = item.id
                        newElement.classList.add('JpTw-bg-enter')
                        if (commonStore.annotationIconConfig.currentOpenPDF !== null && item.id === commonStore.annotationIconConfig.currentOpenPDF.id) {
                            newElement.classList.add('JpTw-bg-active')
                        }
                        const root = createRoot(newElement);
                        root.render(<div
                            style={{
                                marginBottom: '1rem',
                                // height:'2rem',
                                display: "flex",
                                justifyContent: 'flex-start',
                                alignItems: "center",
                                padding: '0.5rem'
                            }}
                            onClick={async (event) => {
                                if (!commonStore.annotationIconConfig.clicked['PencilIconContainer']) {
                                    commonStore.annotationIconConfig.iframeDocument.querySelector('#PencilIconContainer').click()
                                }
                                await displayPDFFile(item)


                            }}
                            key={item.id}
                            id={item.id}

                            title={Utils.getAbbreviateStr(item.name).tooltip===null?null:Utils.getAbbreviateStr(item.name).tooltip}
                        >
                            {Utils.getAbbreviateStr(item.name).text}
                        </div>);

                        // 使用appendChild将这个新的div添加到容器中
                        commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList').querySelector('.p-2').appendChild(newElement);
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
                         maxHeight:'30rem',
                         overflowY:"auto"
                     }}
                >
                    <div className="p-2" id={'JpListContainer'}>

                    </div>

                </div>
            </AnnotationIconContainer>


            <AnnotationIconContainer id={'DeleteIconContainer'} title={'Delete Current PDF'} joinButtonGroup={false}
                                     onClickFunc={() => {

                                     }}>
                <DeleteIcon size={'1.25rem'}

                            onClick={async () => {
                                if (commonStore.annotationIconConfig.currentOpenPDF === null) return
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


                                const PDFReaderContainer = createRoot(document.getElementById('PDFReaderContainer'))
                                PDFReaderContainer.render(<PdfReaderComp/>)


                                await Swal.fire({
                                    icon: "info",
                                    title: `Delete  Success!`,
                                });

                            }}
                />
            </AnnotationIconContainer>


        </div>
    }


    return {
        createFabricCanvas,
        annotationPencilCanvasConfigFunc,
        annotationTextCanvasConfigFunc,
        setElAttr,
        discardActiveObject,
        loadHistory,
        saveHistory,
        CustomAnnotationTools,
        refreshPDFMessage,
        renderCanvas
    }

}


export default usePDFReaderCompHooks
