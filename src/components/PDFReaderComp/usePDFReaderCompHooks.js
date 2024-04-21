import {fabric} from "fabric";
import {useStore} from "../../stores";
import _ from "lodash";
import {RxDividerVertical as VerticalIcon} from "react-icons/rx";
import {CiRead as ReadIcon} from "react-icons/ci";
import {TbPencilExclamation as PencilIcon} from "react-icons/tb";
import {BiText as TextIcon} from "react-icons/bi";
import {createRoot} from "react-dom/client";
import {ImList as ListIcon} from "react-icons/im";
import Utils from "../../utils";
import React, {useEffect} from "react";

const baseURL = 'http://localhost:8082/assets';

const usePDFReaderCompHooks = () => {

    const {commonStore} = useStore()

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
        const canvas = commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
        if (commonStore.annotationIconConfig.history[commonStore.annotationIconConfig.currentOpenPDF.id] === undefined) return
        canvas.loadFromJSON(commonStore.annotationIconConfig.history[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum], function () {
            canvas.renderAll();
        });


    }


    const saveHistory = (pageNum) => {
        if (commonStore.annotationIconConfig.currentOpenPDF === null) return
        const canvas = commonStore.annotationIconConfig.fabricCanvas[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
        commonStore.updateAnnotationIconConfig({
            history: {
                pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                pageNum: pageNum,
                value: canvas.toJSON()
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
            canvas.discardActiveObject(textbox)
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

        canvas.backgroundColor = 'rgba(255, 223, 186, 0.5)';  // 你可以选择任何颜色和透明度

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
        });


        loadHistory(values.pageNum)


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
                    className={`JpTw-flex JpTw-items-center JpTw-justify-center`}
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
                                otherAnnotationIconContainer?.classList?.toggle("JpTw-bg-AEAEAF", false)
                                otherAnnotationIconContainer?.classList?.toggle("JpTw-bg-DDDEDF", false)
                            }
                        })


                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-AEAEAF", true)
                        } else {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-AEAEAF", false)
                        }


                        onClickFunc()


                    }}
                    onMouseEnter={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-DDDEDF", true)
                        }
                    }}
                    onMouseLeave={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-DDDEDF", false)
                        }

                    }}>
            {children}
        </div>
    }


    const CustomAnnotationTools = () => {

        return <div className={'JpTw-flex JpTw-items-center '}>
            <div id={'JpAnnotationConfig'} style={{display: "flex"}}>
                <input type="color" style={{marginRight: '1rem'}} id={'JpColorPicker'} defaultValue={'#FF0000'}/>
            </div>

            <VerticalIcon size={'1.25rem'} style={{marginRight: '1rem'}} id={'JpAnnotationConfigDivider'}/>


            <AnnotationIconContainer
                id={'ReadIconContainer'}
                title={'Only Read'}
                initFunc={() => {
                    commonStore.annotationIconConfig.iframeDocument.getElementById('ReadIconContainer')?.classList?.toggle("JpTw-bg-AEAEAF", true)
                    commonStore.updateAnnotationIconConfig({
                        clicked: {
                            id: 'ReadIconContainer',
                            value: true
                        }
                    })

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
                    commonStore.updateTestVars()

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

                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup[commonStore.annotationIconConfig.currentOpenPDF.id]).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
                    // console.log(_.cloneDeep(values), 'values')
                    createFabricCanvas(values, annotationPencilCanvasConfigFunc)
                    commonStore.updateAnnotationIconConfig({
                        canvasAnnotationElGroup: {
                            pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                            pageNum: `${pageNum}`,
                            value: {
                                ...values,
                                fabricRendered: true,
                            }
                        }
                    })


                })


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

                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup[commonStore.annotationIconConfig.currentOpenPDF.id]).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[commonStore.annotationIconConfig.currentOpenPDF.id][pageNum]
                    createFabricCanvas(values, annotationTextCanvasConfigFunc)
                    commonStore.updateAnnotationIconConfig({
                        canvasAnnotationElGroup: {
                            pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                            pageNum: `${pageNum}`,
                            value: {
                                ...values,
                                fabricRendered: true
                            }
                        }
                    })


                })


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
                    const JpPdfListEl = commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList')
                    JpPdfListEl.querySelector('#JpListContainer').innerHTML = ''
                    commonStore.annotationIconConfig.pdfAsset.forEach(item => {
                        const newElement = document.createElement('div');
                        newElement.id = item.id
                        newElement.classList.add('JpTw-bg-DDDEDF-hover')
                        if (commonStore.annotationIconConfig.currentOpenPDF !== null && item.id === commonStore.annotationIconConfig.currentOpenPDF.id) {
                            newElement.classList.add('JpTw-bg-AEAEAF')
                        }
                        const root = createRoot(newElement);
                        root.render(<div
                            style={{
                                marginBottom: '1rem',
                                // height:'2rem',
                                display:"flex",
                                justifyContent:'flex-start',
                                alignItems:"center",
                                padding:'0.5rem'


                            }}
                            onClick={async () => {
                                // const viewerApp = await commonStore.annotationIconConfig.viewer.initialize()
                                await commonStore.annotationIconConfig.viewerApp.open({data: await Utils.urlToUint8Array(item.url)})
                                // await viewerApp.open({data: await Utils.urlToUint8Array(item.url)})
                                commonStore.updateAnnotationIconConfig({
                                    currentOpenPDF: item
                                })
                                refreshPDFMessage(
                                    commonStore.annotationIconConfig.currentOpenPDF.name,
                                    1,
                                    commonStore.annotationIconConfig.pagesCount,
                                    commonStore.annotationIconConfig.JpDocumentMessageRoot
                                )
                            }}
                            key={item.id}

                        >
                            {item.name}
                        </div>);

                        // 使用appendChild将这个新的div添加到容器中
                        JpPdfListEl.querySelector('.p-2').appendChild(newElement);
                    })
                    JpPdfListEl.classList.toggle('JpTw-hidden')


                }}
                joinButtonGroup={false}
            >
                <ListIcon size={'1.25rem'}/>
                <div id={'JpPdfList'}
                     key={commonStore.testVars.length}
                     style={{
                         position: "absolute",
                         top: "100%",
                         right: '100%',
                         display: "flex",
                         flexDirection: "column",
                         backgroundColor: 'white',
                         zIndex: 50,
                         width: '10rem',
                         padding: '0.5rem',
                         borderRadius: '1rem'

                     }}
                >
                    <div className="p-2" id={'JpListContainer'}>

                    </div>

                    <div className="p-2">

                        <button
                            type="submit"
                            className={Utils.prefixClassNames("flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-[#AEAEAF]")}
                            role="menuitem"
                            onClick={async () => {
                                if (commonStore.annotationIconConfig.currentOpenPDF === null) return
                                Utils.removeElementById(commonStore.annotationIconConfig.currentOpenPDF.id, commonStore.annotationIconConfig.iframeDocument)
                                commonStore.updateAnnotationIconConfig({
                                    pdfAsset: {
                                        id: commonStore.annotationIconConfig.currentOpenPDF.id,
                                        value: null
                                    }
                                })
                                commonStore.updateAnnotationIconConfig({
                                    currentOpenPDF: null
                                })

                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    height: '4px',
                                    width: '4px',
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>

                            Delete Current PDF
                        </button>

                    </div>
                </div>
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
        refreshPDFMessage
    }

}


export default usePDFReaderCompHooks
