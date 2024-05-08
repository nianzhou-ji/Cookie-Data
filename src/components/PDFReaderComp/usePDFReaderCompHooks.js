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
import {fetchFile, toBlobURL} from '@ffmpeg/util'
import CustomAnnotationTools from "./CustomAnnotationTools";

const baseURL = 'http://localhost:8082/assets';

const usePDFReaderCompHooks = () => {

    const {commonStore} = useStore()



    const initPDFReaderComp = async () => {

        const currentObj = commonStore.getCurrentDocumentObj()
        if (currentObj !== null) {
            // console.log(currentObj.PDFAnnotationData, 'PDFAnnotationData')
            commonStore.initPDFAnnotationData(currentObj.PDFAnnotationData)
        }


        const viewer = document.querySelector('pdfjs-viewer-element')

// Wait for the viewer initialization, receive PDFViewerApplication
        const viewerApp = await viewer.initialize()

        const iframeDocument = viewer.shadowRoot.querySelector('iframe').contentDocument
        commonStore.updateAnnotationIconConfig({
            iframeDocument: iframeDocument
        })


        iframeDocument.querySelector('#toolbarViewer')?.classList.add('JpTw-flex', 'JpTw-items-center', 'JpTw-justify-between')
        const waitedEls = [
            '#previous',
            '#next',
            '#pageNumber',
            '#numPages',
            '.splitToolbarButton.hiddenSmallView',
            '.toolbarButtonSpacer',
            '.splitToolbarButtonSeparator',
            '#openFile',
            '#print',
            '#download',
            '.verticalToolbarSeparator.hiddenMediumView',
            '#editorModeButtons',
            '#editorModeButtons',
            '#editorModeSeparator',
            '#secondaryToolbarToggle',
            '#scaleSelectContainer',
            '#toolbarViewerMiddle .splitToolbarButton',
        ]
        waitedEls.forEach(item => {
            iframeDocument.querySelector(item)?.classList.add('JpTw-hidden')
        })


        const toolbarViewerMiddleEl = iframeDocument.getElementById('toolbarViewerMiddle')
        if (toolbarViewerMiddleEl === null) return
        const newElement = document.createElement('div');
        toolbarViewerMiddleEl.appendChild(newElement)
        newElement.id = 'JpDocumentMessage'
        newElement.classList.add('JpTw-flex', 'JpTw-items-center')


        const JpDocumentMessageRoot = createRoot(commonStore.annotationIconConfig.iframeDocument.getElementById('JpDocumentMessage'))
        commonStore.updateAnnotationIconConfig({
            JpDocumentMessageRoot
        })


        const viewerDivEl = iframeDocument.querySelector("#viewer")
        const toolbarViewerRightEl = iframeDocument.getElementById('toolbarViewerRight');
        toolbarViewerRightEl.classList.add('JpTw-flex', 'JpTw-items-center', 'JpTw-justify-center')
        const CustomAnnotationToolsContainers = document.createElement('div')
        CustomAnnotationToolsContainers.classList.add('JpTw-flex', 'JpTw-items-center', 'JpTw-justify-center')
        toolbarViewerRightEl.appendChild(CustomAnnotationToolsContainers)
        const toolbarViewerRightElRoot = createRoot(CustomAnnotationToolsContainers);
        toolbarViewerRightElRoot.render(<CustomAnnotationTools/>)

        commonStore.updateAnnotationIconConfig(
            {
                viewerApp,
                viewer
            }
        )



        viewerApp.eventBus.on('pagechanging', (event) => {
            // console.log(commonStore.annotationIconConfig.currentOpenPDF.id, 'commonStore.annotationIconConfig.currentOpenPDF.id')
            const pageNumber = event.pageNumber
            const previous = event.previous

            commonStore.updateAnnotationIconConfig({
                currentPageNum: pageNumber
            })


            refreshPDFMessage(
                commonStore.annotationIconConfig.currentOpenPDF.name,
                pageNumber,
                commonStore.annotationIconConfig.pagesCount,
                commonStore.annotationIconConfig.JpDocumentMessageRoot
            )


            renderCanvas(previous)
            renderCanvas(pageNumber)


        })

        viewerApp.eventBus.on('pagesloaded', (event) => {
            commonStore.updateAnnotationIconConfig({
                pagesCount: event.pagesCount
            })

            refreshPDFMessage(
                commonStore.annotationIconConfig.currentOpenPDF.name,
                1,
                event.pagesCount,
                commonStore.annotationIconConfig.JpDocumentMessageRoot
            )

            commonStore.annotationIconConfig.iframeDocument.querySelector('#ReadIconContainer')?.click()

        })


        viewerApp.eventBus.on('pagerendered', (event) => {
            const pageNum = event.pageNumber
            const pageDivEl = viewerDivEl.querySelector(`[data-page-number="${pageNum}"]`)
            const canvasAnnotationEl = document.createElement('canvas');
            // canvasAnnotationEl.classList.add('bg-red-500', 'bg-opacity-50')
            const pageDivElSize = pageDivEl.querySelector('.canvasWrapper').getBoundingClientRect()
            canvasAnnotationEl.id = 'JpCanvasAnnotationEl' + pageNum
            if (!viewerDivEl.querySelector('#JpCanvasAnnotationEl' + pageNum)) {
                pageDivEl.appendChild(canvasAnnotationEl)
                fabric.window = viewer.shadowRoot.querySelector('iframe').contentWindow;
                fabric.document = viewer.shadowRoot.querySelector('iframe').contentWindow.document;
                commonStore.updateAnnotationZIndex()
                commonStore.updateAnnotationIconConfig({
                    canvasAnnotationElGroup: {
                        pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                        pageNum: `${pageNum}`,
                        value: {
                            pageDivElSize,
                            canvasAnnotationEl,
                            pageDivEl,
                            pageNum: `${pageNum}`
                        }
                    },
                    canvasBoundingClientRect: {
                        pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                        pageNum: `${pageNum}`,
                        width: pageDivElSize.width,
                        height: pageDivElSize.height,
                    }


                })


                renderCanvas(pageNum)

                // console.log('pagerendered', pageNum)


            }


        });


    }

    const renderCanvas = (pageNumber) => {
        if (commonStore.annotationIconConfig.currentOpenPDF === null) {
            console.log('commonStore.annotationIconConfig.currentOpenPDF===null')
            return
        }

        const canvasAnnotationElItem = commonStore.annotationIconConfig.canvasAnnotationElGroup[commonStore.annotationIconConfig.currentOpenPDF.id]
        if (canvasAnnotationElItem === undefined) {
            return
        }
        const values = canvasAnnotationElItem[pageNumber]




        if (commonStore.annotationIconConfig.clicked['ReadIconContainer'] ) {
            createFabricCanvas(values)
            // console.log('ReadIconContainer render')

        }


        if (commonStore.annotationIconConfig.clicked['PencilIconContainer'] ) {
            createFabricCanvas(values, annotationPencilCanvasConfigFunc)
            // console.log('PencilIconContainer render')

        }


        if (commonStore.annotationIconConfig.clicked['TextIconContainer']) {
            createFabricCanvas(values, annotationTextCanvasConfigFunc)
            // console.log('TextIconContainer render')
        }


        commonStore.updateAnnotationIconConfig({
            canvasAnnotationElGroup: {
                pdfID: commonStore.annotationIconConfig.currentOpenPDF.id,
                key: `${pageNumber}`,
                value: values
            }
        })

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
                <div id={'JpPDFName'} style={{fontWeight: "bold", marginRight: '2rem'}} title={Utils.getAbbreviateStr(name, 20).tooltip}>{Utils.getAbbreviateStr(name, 20).text}</div>
                <div id={'JpPDFPageMessage'} style={{fontWeight: "bold", alignItems:"center"}}>{currentPageNum}/{pageCounts} Page</div>
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
        if (values === undefined) return

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
            'object:removed'
        ]

        changeEvents.forEach(item => {
            canvas.on(item, function (event) {
                saveHistory(values.pageNum)


                commonStore.setIsDocumentsGroupDataUpdate(true)

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





    const displayPDFFile = async (pdfItem) => {
        const JpPdfListEl = commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList')
        const pdfjsViewerElement = document.querySelector('#PDFReaderContainer pdfjs-viewer-element')
        pdfjsViewerElement.setAttribute('src', await  toBlobURL(pdfItem.url, 'application/pdf'));

        await initPDFReaderComp()

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





    return {
        createFabricCanvas,
        annotationPencilCanvasConfigFunc,
        annotationTextCanvasConfigFunc,
        setElAttr,
        discardActiveObject,
        loadHistory,
        saveHistory,
        refreshPDFMessage,
        renderCanvas,
        displayPDFFile,
        initPDFReaderComp
    }

}


export default usePDFReaderCompHooks
