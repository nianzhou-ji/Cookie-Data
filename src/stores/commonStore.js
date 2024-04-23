import {comparer, makeAutoObservable} from "mobx";
import _ from 'lodash'
import indexedDBEngine from "../indexDBUtils/indexDBUtils";
import Utils from "../utils";
import {v4 as uuidv4} from 'uuid';
import {createRoot} from "react-dom/client";
import PdfReaderComp from "../components/PDFReaderComp/PDFReaderComp";
import React from "react";


class CommonStore {


    BASE_URL = 'http://localhost:8082/assets'


    testVars = [
        'test1.pdf',
        'test2.pdf',
        'test3.pdf',
    ]

    updateTestVars() {
        const temp = this.testVars
        temp.push(new Date())
        this.testVars = temp
    }


    savePDFAnnotationStore = () => {
        const pdfAssets = _.cloneDeep(this.annotationIconConfig.pdfAssets)
        const annotationHistory = _.cloneDeep(this.annotationIconConfig.history)
        const canvasBoundingClientRect = _.cloneDeep(this.annotationIconConfig.canvasBoundingClientRect)
        return {pdfAssets, annotationHistory, canvasBoundingClientRect}
    }

    initPDFReaderData = () => {
        this.annotationIconConfig = {
            canvasBoundingClientRect: {},
            clicked: {},
            iframeDocument: null,
            pagesCount: 0,
            currentPageNum: 1,
            canvasAnnotationElGroup: {},
            // history: {},
            history: {},
            canvasObjSelectionState: false,
            fabricCanvas: {},
            pdfAssets: [],
            viewerApp: null,
            viewer: null,
            currentOpenPDF: null,
            JpDocumentMessageRoot: null
        }
    }


    annotationIconConfig = {
        canvasBoundingClientRect: {},
        clicked: {},
        iframeDocument: null,
        pagesCount: 0,
        currentPageNum: 1,
        canvasAnnotationElGroup: {},
        // history: {},
        history: {},
        canvasObjSelectionState: false,
        fabricCanvas: {},
        pdfAssets: [],
        viewerApp: null,
        viewer: null,
        currentOpenPDF: null,
        JpDocumentMessageRoot: null
    }

    initPDFAnnotationData(value) {
        // console.log('initPDFAnnotationData', value)
        if (value === undefined) return
        const temp = this.annotationIconConfig
        temp.history = value.annotationHistory
        temp.pdfAssets = value.pdfAssets
        temp.canvasBoundingClientRect = value.canvasBoundingClientRect
        this.annotationIconConfig = temp

    }


    updateAnnotationIconConfig(value) {
        const temp = this.annotationIconConfig
        if (value.pdfAssets !== undefined) {
            if (value.pdfAssets.id !== null && value.pdfAssets.value === null) {
                temp.pdfAssets = temp.pdfAssets.filter(item => item.id !== value.pdfAssets.id)
            }

            if (value.pdfAssets.id === null && value.pdfAssets.value !== null) {
                temp.pdfAssets.push({
                    ...value.pdfAssets.value,
                    id: 'Jp' + uuidv4()
                })
            }

        }

        if (value.canvasBoundingClientRect !== undefined) {


            if (temp.canvasBoundingClientRect[value.canvasBoundingClientRect.pdfID] === undefined) {
                temp.canvasBoundingClientRect[value.canvasBoundingClientRect.pdfID] = {}
            }

            if (temp.canvasBoundingClientRect[value.canvasBoundingClientRect.pdfID][value.canvasBoundingClientRect.pageNum] === undefined) {
                temp.canvasBoundingClientRect[value.canvasBoundingClientRect.pdfID][value.canvasBoundingClientRect.pageNum] = {}
            }

            temp.canvasBoundingClientRect[value.canvasBoundingClientRect.pdfID][value.canvasBoundingClientRect.pageNum] = {
                width: value.canvasBoundingClientRect.width,
                height: value.canvasBoundingClientRect.height,
            }


        }

        if (value.JpDocumentMessageRoot !== undefined) {
            temp.JpDocumentMessageRoot = value.JpDocumentMessageRoot
        }

        if (value.currentOpenPDF !== undefined) {
            temp.currentOpenPDF = value.currentOpenPDF
        }


        if (value.viewer !== undefined) {
            temp.viewer = value.viewer
        }


        if (value.viewerApp !== undefined) {
            temp.viewerApp = value.viewerApp
        }

        if (value.fabricCanvas !== undefined) {
            if (temp.fabricCanvas[value.fabricCanvas.pdfID] === undefined) {
                temp.fabricCanvas[value.fabricCanvas.pdfID] = {}
            }
            temp.fabricCanvas[value.fabricCanvas.pdfID][value.fabricCanvas.key] = value.fabricCanvas.value
        }

        if (value.canvasObjSelectionState !== undefined) {
            temp.canvasObjSelectionState = value.canvasObjSelectionState
        }

        if (value.history !== undefined) {
            if (temp.history[value.history.pdfID] === undefined) {
                temp.history[value.history.pdfID] = {}
            }
            temp.history[value.history.pdfID][value.history.pageNum] = value.history.value

            // if (temp.history[value.history.pdfID]['canvasBoundingClientRect'] === undefined) {
            //     temp.history[value.history.pdfID]['canvasBoundingClientRect'] = {
            //         width: this.annotationIconConfig.canvasBoundingClientRect.width,
            //         height: this.annotationIconConfig.canvasBoundingClientRect.height,
            //     }
            // }
            // temp.history[value.history.pdfID]['canvasBoundingClientRect'] = this.annotationIconConfig.canvasBoundingClientRect

        }

        if (value.canvasAnnotationElGroup !== undefined) {
            if (temp.canvasAnnotationElGroup[value.canvasAnnotationElGroup.pdfID] === undefined) {
                temp.canvasAnnotationElGroup[value.canvasAnnotationElGroup.pdfID] = {}
            }
            temp.canvasAnnotationElGroup[value.canvasAnnotationElGroup.pdfID][value.canvasAnnotationElGroup.pageNum] = value.canvasAnnotationElGroup.value
        }

        if (value.currentPageNum !== undefined) {
            temp.currentPageNum = value.currentPageNum
        }


        if (value.pagesCount !== undefined) {
            temp.pagesCount = value.pagesCount
        }

        if (value.clicked !== undefined) {
            temp.clicked[value.clicked.id] = value.clicked.value
            this.updateAnnotationZIndex()
        }


        if (value.iframeDocument !== undefined) {
            temp.iframeDocument = value.iframeDocument
        }

        this.annotationIconConfig = temp

    }


    updateAnnotationZIndex() {
        const elements = this.annotationIconConfig.iframeDocument.querySelectorAll('.JpCanvasAnnotationWrapper');
        elements.forEach((element, index) => {
            if (this.annotationIconConfig.clicked['ReadIconContainer']) {
                element.style.zIndex = '1'
            } else {
                element.style.zIndex = '3'
            }
        });
    }


    initMarkdownData = {
        "time": 1711019875915,
        "blocks": [],
        "version": "2.29.0"
    }
    initProcessData = {
        "store": {
            "document:document": {
                "gridSize": 10,
                "name": "",
                "meta": {},
                "id": "document:document",
                "typeName": "document"
            },
            "page:page": {
                "meta": {},
                "id": "page:page",
                "name": "Page 1",
                "index": "a1",
                "typeName": "page"
            }
        },
        "schema": {
            "schemaVersion": 1,
            "storeVersion": 4,
            "recordVersions": {
                "asset": {
                    "version": 1,
                    "subTypeKey": "type",
                    "subTypeVersions": {
                        "image": 3,
                        "video": 3,
                        "bookmark": 1
                    }
                },
                "camera": {"version": 1},
                "document": {"version": 2},
                "instance": {"version": 24},
                "instance_page_state": {"version": 5},
                "page": {"version": 1},
                "shape": {
                    "version": 3,
                    "subTypeKey": "type",
                    "subTypeVersions": {
                        "group": 0,
                        "text": 1,
                        "bookmark": 2,
                        "draw": 1,
                        "geo": 8,
                        "note": 5,
                        "line": 4,
                        "frame": 0,
                        "arrow": 3,
                        "highlight": 0,
                        "embed": 4,
                        "image": 3,
                        "video": 2
                    }
                },
                "instance_presence": {"version": 5},
                "pointer": {"version": 1}
            }
        }
    }


    searchEngineConfig = {
        searchResultMenuOpen: false,
        searchedText: '',
        searchResultList: [],

        isCaseSensitive: false,
        findAllMatches: true,
        minMatchCharLength: 5,
        location: 0,
        threshold: 0.6,
        distance: 100,
        ignoreLocation: true,

    }


    patchSearchEngineConfig(value) {
        const temp = _.cloneDeep(this.searchEngineConfig)
        if (value.searchResultMenuOpen !== undefined) {
            temp.searchResultMenuOpen = value.searchResultMenuOpen
        }

        if (value.searchedText !== undefined) {
            temp.searchedText = value.searchedText
        }
        if (value.searchResultList !== undefined) {
            temp.searchResultList = value.searchResultList
        }


        if (value.isCaseSensitive !== undefined) {
            temp.isCaseSensitive = value.isCaseSensitive
        }

        if (value.findAllMatches !== undefined) {
            temp.findAllMatches = value.findAllMatches
        }
        if (value.minMatchCharLength !== undefined) {
            temp.minMatchCharLength = value.minMatchCharLength
        }
        if (value.location !== undefined) {
            temp.location = value.location
        }


        if (value.threshold !== undefined) {
            temp.threshold = value.threshold
        }


        if (value.distance !== undefined) {
            temp.distance = value.distance
        }


        if (value.ignoreLocation !== undefined) {
            temp.ignoreLocation = value.ignoreLocation
        }
        this.searchEngineConfig = temp


    }


    VERSION = 'V1.3'


    addDocumentName = 'default'


    updateAddDocumentName(value) {
        this.addDocumentName = value
    }


    appCompOpenConfig = {
        markdownAppOpen: true,
        errorPageAppOpen: false,
        processAppOpen: false,
        toolboxAppOpen: false,
        PDFReaderAppOpen: false
    }

    updateAppCompOpenConfig(value) {
        const temp = _.cloneDeep(this.appCompOpenConfig)
        if (value.PDFReaderAppOpen !== undefined) {
            temp.PDFReaderAppOpen = value.PDFReaderAppOpen

            if (value.PDFReaderAppOpen) {
                // const viewer = document.querySelector('pdfjs-viewer-element')
                // if (viewer === null) {
                //     const PDFReaderContainer = createRoot(document.getElementById('PDFReaderContainer'))
                //     PDFReaderContainer.render(<PdfReaderComp/>)
                //     // console.log('PdfReaderComp render')
                // }


                const PDFReaderContainer = createRoot(document.getElementById('PDFReaderContainer'))
                PDFReaderContainer.render(<PdfReaderComp/>)
                // console.log('PdfReaderComp render')


            }


        }
        if (value.markdownAppOpen !== undefined) {
            temp.markdownAppOpen = value.markdownAppOpen
        }
        if (value.processAppOpen !== undefined) {
            temp.processAppOpen = value.processAppOpen
        }

        if (value.toolboxAppOpen !== undefined) {
            temp.toolboxAppOpen = value.toolboxAppOpen
        }
        if (value.errorPageAppOpen !== undefined) {
            temp.errorPageAppOpen = value.errorPageAppOpen
        }
        this.appCompOpenConfig = temp
    }


    documentSelectionOpen = false

    updateDocumentSelectionOpen(value) {
        this.documentSelectionOpen = value
    }

    markdownObj = null
    processDrawObj = null


    updateProcessDrawObj(value) {
        this.processDrawObj = value
    }

    updateMarkdownObj(value) {
        this.markdownObj = value
    }


    documentsGroup = []

    isDocumentsGroupDataUpdate = false

    setIsDocumentsGroupDataUpdate(value) {
        this.isDocumentsGroupDataUpdate = value
    }

    addDocumentsGroup(value) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        tempObj.push(value)
        this.documentsGroup = tempObj
    }

    updateDocumentsGroup(value) {
        this.documentsGroup = value
    }

    downloadMarkdown() {
        const obj = this.getCurrentDocumentObj()

        // 创建一个新的 Blob 对象，内容为 Markdown 文本
        const blob = new Blob([obj.markdownData], {type: 'text/markdown;charset=utf-8'});

        // 创建一个指向 Blob 对象的 URL
        const url = URL.createObjectURL(blob);

        // 创建一个临时的 a 标签用于下载
        const a = document.createElement('a');
        a.href = url;
        a.download = obj.name + '.md';

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


    downloadAllData() {
        // 创建一个新的 Blob 对象，内容为 Markdown 文本
        const blob = new Blob([JSON.stringify(_.cloneDeep(this.documentsGroup))], {type: 'application/json;charset=utf-8'});

        // 创建一个指向 Blob 对象的 URL
        const url = URL.createObjectURL(blob);

        // 创建一个临时的 a 标签用于下载
        const a = document.createElement('a');
        a.href = url;
        a.download = Utils.formatTime(new Date()) + '_backup.json';

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


    mergeArrays(arrays) {
        let map = new Map();

        arrays.forEach(array => {
            array.forEach(obj => {
                map.set(obj.id, obj);
            });
        });

        return Array.from(map.values());
    }

    async parsingBackupData(files) {

        try {
            // 获取选中的所有文件
            const filesArray = Array.from(files);

            // 按照文件的最后修改时间进行排序
            filesArray.sort(function (a, b) {
                return a.lastModified - b.lastModified;
            });


            async function readFiles(filesArray) {
                let resTemp = [];

                for (const file of filesArray) {
                    // 创建一个用于读取文件的函数，返回一个 Promise
                    const readFile = (file) => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = function (event) {
                                const json = JSON.parse(event.target.result);
                                resTemp.push(json);
                                // console.log(json);
                                resolve(); // 文件读取成功，解决 Promise
                            };

                            reader.readAsText(file);
                        });
                    };

                    // 等待文件读取完成
                    await readFile(file);
                }


                return resTemp
            }

            const res = await readFiles(filesArray)

            res.push(_.cloneDeep(this.documentsGroup))
            // console.log(res, 'res')
            this.updateDocumentsGroup(this.mergeArrays(res))

            return await this.saveIndexedDB()
        } catch (e) {
            return {state: false, error: e}
        }


    }


    async initDocumentsGroup() {
        await indexedDBEngine.open()
        const res = await indexedDBEngine.get(1)

        if (res === undefined) return
        // console.log(res, 'initDocumentsGroup')
        this.updateDocumentsGroup(res.documentsGroup)

        if (res.documentsGroup !== undefined && res.documentsGroup.length > 0) {
            this.updateCurrentDocumentID(res.documentsGroup[res.documentsGroup.length - 1].id)
        }


    }


    async saveIndexedDB() {
        try {
            if (this.markdownObj !== null) {
                const res = await this.markdownObj.save()
                this.patchDocumentsGroup(res, 'markdownData')
            }

            if (this.processDrawObj !== null) {
                const snapshot = this.processDrawObj.store.getSnapshot('all')
                // this.patchDocumentsGroup(JSON.parse(snapshot), 'processData')
                this.patchDocumentsGroup(snapshot, 'processData')
            }


            const viewer = document.querySelector('pdfjs-viewer-element')
            if (viewer !== null) {
                const PDFAnnotationData = this.savePDFAnnotationStore()
                this.patchDocumentsGroup(PDFAnnotationData, 'PDFAnnotationData')
            }


            await indexedDBEngine.open()

            await indexedDBEngine.patch({
                id: 1,
                documentsGroup: _.cloneDeep(this.documentsGroup)
            })

            return {state: true}
        } catch (e) {
            return {state: false, error: e}
        }


    }


    deleteDocumentsGroup(id) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        this.documentsGroup = tempObj.filter(item => item.id !== id)
    }

    currentDocumentID = ''


    patchDocumentsGroup(data, type) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        // const tempObj = this.documentsGroup
        const res = tempObj.find(item => item.id === this.currentDocumentID)
        if (res !== undefined) {
            if (type === 'markdownData') {
                res['markdownData'] = data
                this.documentsGroup = tempObj
            }

            if (type === 'processData') {
                res['processData'] = data
                this.documentsGroup = tempObj
            }


            if (type === 'PDFAnnotationData') {
                res['PDFAnnotationData'] = data
                this.documentsGroup = tempObj
            }
        }

    }


    getCurrentDocumentObj() {
        if (this.documentsGroup.length === 0) return null
        const res = this.documentsGroup.find(item => item.id === this.currentDocumentID)
        if (res === undefined) return null
        return _.cloneDeep(res)
    }


    updateCurrentDocumentID(value) {
        this.currentDocumentID = value
    }


    constructor(rootStore) {
        this.rootStore = rootStore
        //成为响应式
        makeAutoObservable(this)
    }
}

export default CommonStore


