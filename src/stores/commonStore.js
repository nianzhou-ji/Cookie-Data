import {makeAutoObservable} from "mobx";
import _ from 'lodash'
import indexedDBEngine from "../indexDBUtils/indexDBUtils";
import Utils from "../utils";
import {v4 as uuidv4} from 'uuid';


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


    annotationIconConfig = {
        canvasBoundingClientRect: null,
        clicked: {},
        iframeDocument: null,
        pagesCount: 0,
        currentPageNum: 1,
        canvasAnnotationElGroup: {},
        // history: {},
        history: {
            "test2-sfegge": {
                "1": {
                    "version": "5.3.0",
                    "objects": [
                        {
                            "type": "path",
                            "version": "5.3.0",
                            "originX": "left",
                            "originY": "top",
                            "left": 163,
                            "top": 94.5,
                            "width": 29,
                            "height": 27,
                            "fill": null,
                            "stroke": "#ff0000",
                            "strokeWidth": 3,
                            "strokeDashArray": null,
                            "strokeLineCap": "round",
                            "strokeDashOffset": 0,
                            "strokeLineJoin": "round",
                            "strokeUniform": false,
                            "strokeMiterLimit": 10,
                            "scaleX": 1,
                            "scaleY": 1,
                            "angle": 0,
                            "flipX": false,
                            "flipY": false,
                            "opacity": 1,
                            "shadow": null,
                            "visible": true,
                            "backgroundColor": "",
                            "fillRule": "nonzero",
                            "paintFirst": "fill",
                            "globalCompositeOperation": "source-over",
                            "skewX": 0,
                            "skewY": 0,
                            "path": [
                                [
                                    "M",
                                    178.497,
                                    123
                                ],
                                [
                                    "Q",
                                    178.5,
                                    123,
                                    178,
                                    122.5
                                ],
                                [
                                    "Q",
                                    177.5,
                                    122,
                                    178,
                                    122
                                ],
                                [
                                    "Q",
                                    178.5,
                                    122,
                                    180,
                                    121.5
                                ],
                                [
                                    "Q",
                                    181.5,
                                    121,
                                    182.5,
                                    120.5
                                ],
                                [
                                    "Q",
                                    183.5,
                                    120,
                                    184.5,
                                    119.5
                                ],
                                [
                                    "Q",
                                    185.5,
                                    119,
                                    186.5,
                                    119
                                ],
                                [
                                    "Q",
                                    187.5,
                                    119,
                                    188.5,
                                    118.5
                                ],
                                [
                                    "Q",
                                    189.5,
                                    118,
                                    190.5,
                                    117.5
                                ],
                                [
                                    "Q",
                                    191.5,
                                    117,
                                    191.5,
                                    116.5
                                ],
                                [
                                    "Q",
                                    191.5,
                                    116,
                                    192.5,
                                    115.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    115,
                                    193.5,
                                    114.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    114,
                                    193.5,
                                    113.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    113,
                                    193.5,
                                    112.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    112,
                                    193.5,
                                    111.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    111,
                                    193.5,
                                    110.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    110,
                                    193.5,
                                    109.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    109,
                                    193.5,
                                    108.5
                                ],
                                [
                                    "Q",
                                    193.5,
                                    108,
                                    193,
                                    107.5
                                ],
                                [
                                    "Q",
                                    192.5,
                                    107,
                                    192,
                                    107
                                ],
                                [
                                    "Q",
                                    191.5,
                                    107,
                                    191,
                                    106.5
                                ],
                                [
                                    "Q",
                                    190.5,
                                    106,
                                    189.5,
                                    105
                                ],
                                [
                                    "Q",
                                    188.5,
                                    104,
                                    188,
                                    104
                                ],
                                [
                                    "Q",
                                    187.5,
                                    104,
                                    186.5,
                                    103.5
                                ],
                                [
                                    "Q",
                                    185.5,
                                    103,
                                    185,
                                    102.5
                                ],
                                [
                                    "Q",
                                    184.5,
                                    102,
                                    183,
                                    102
                                ],
                                [
                                    "Q",
                                    181.5,
                                    102,
                                    180.5,
                                    102
                                ],
                                [
                                    "Q",
                                    179.5,
                                    102,
                                    178.5,
                                    101.5
                                ],
                                [
                                    "Q",
                                    177.5,
                                    101,
                                    177,
                                    100.5
                                ],
                                [
                                    "Q",
                                    176.5,
                                    100,
                                    175.5,
                                    100
                                ],
                                [
                                    "Q",
                                    174.5,
                                    100,
                                    174,
                                    99.5
                                ],
                                [
                                    "Q",
                                    173.5,
                                    99,
                                    173,
                                    98.5
                                ],
                                [
                                    "Q",
                                    172.5,
                                    98,
                                    171.5,
                                    97.5
                                ],
                                [
                                    "Q",
                                    170.5,
                                    97,
                                    170,
                                    96.5
                                ],
                                [
                                    "Q",
                                    169.5,
                                    96,
                                    169,
                                    96
                                ],
                                [
                                    "Q",
                                    168.5,
                                    96,
                                    168,
                                    96
                                ],
                                [
                                    "Q",
                                    167.5,
                                    96,
                                    167,
                                    96
                                ],
                                [
                                    "Q",
                                    166.5,
                                    96,
                                    166.5,
                                    96.5
                                ],
                                [
                                    "Q",
                                    166.5,
                                    97,
                                    166.5,
                                    98.5
                                ],
                                [
                                    "Q",
                                    166.5,
                                    100,
                                    166.5,
                                    100.5
                                ],
                                [
                                    "Q",
                                    166.5,
                                    101,
                                    166.5,
                                    101.5
                                ],
                                [
                                    "Q",
                                    166.5,
                                    102,
                                    166,
                                    103.5
                                ],
                                [
                                    "Q",
                                    165.5,
                                    105,
                                    165,
                                    106
                                ],
                                [
                                    "Q",
                                    164.5,
                                    107,
                                    164.5,
                                    107.5
                                ],
                                [
                                    "Q",
                                    164.5,
                                    108,
                                    164.5,
                                    109
                                ],
                                [
                                    "Q",
                                    164.5,
                                    110,
                                    164.5,
                                    111
                                ],
                                [
                                    "Q",
                                    164.5,
                                    112,
                                    164.5,
                                    113
                                ],
                                [
                                    "Q",
                                    164.5,
                                    114,
                                    165,
                                    114.5
                                ],
                                [
                                    "Q",
                                    165.5,
                                    115,
                                    166,
                                    115
                                ],
                                [
                                    "Q",
                                    166.5,
                                    115,
                                    166.5,
                                    116
                                ],
                                [
                                    "Q",
                                    166.5,
                                    117,
                                    167,
                                    117
                                ],
                                [
                                    "Q",
                                    167.5,
                                    117,
                                    167.5,
                                    117.5
                                ],
                                [
                                    "Q",
                                    167.5,
                                    118,
                                    168,
                                    118
                                ],
                                [
                                    "Q",
                                    168.5,
                                    118,
                                    168.5,
                                    118.5
                                ],
                                [
                                    "Q",
                                    168.5,
                                    119,
                                    169,
                                    119.5
                                ],
                                [
                                    "Q",
                                    169.5,
                                    120,
                                    170,
                                    120
                                ],
                                [
                                    "Q",
                                    170.5,
                                    120,
                                    171,
                                    120
                                ],
                                [
                                    "Q",
                                    171.5,
                                    120,
                                    172,
                                    120.5
                                ],
                                [
                                    "Q",
                                    172.5,
                                    121,
                                    173,
                                    121
                                ],
                                [
                                    "Q",
                                    173.5,
                                    121,
                                    174,
                                    121.5
                                ],
                                [
                                    "Q",
                                    174.5,
                                    122,
                                    175,
                                    122
                                ],
                                [
                                    "Q",
                                    175.5,
                                    122,
                                    176,
                                    122.5
                                ],
                                [
                                    "Q",
                                    176.5,
                                    123,
                                    177.5,
                                    123
                                ],
                                [
                                    "L",
                                    178.503,
                                    123
                                ]
                            ]
                        },
                        {
                            "type": "path",
                            "version": "5.3.0",
                            "originX": "left",
                            "originY": "top",
                            "left": 863,
                            "top": 102.5,
                            "width": 25,
                            "height": 20,
                            "fill": null,
                            "stroke": "#ff0000",
                            "strokeWidth": 3,
                            "strokeDashArray": null,
                            "strokeLineCap": "round",
                            "strokeDashOffset": 0,
                            "strokeLineJoin": "round",
                            "strokeUniform": false,
                            "strokeMiterLimit": 10,
                            "scaleX": 1,
                            "scaleY": 1,
                            "angle": 0,
                            "flipX": false,
                            "flipY": false,
                            "opacity": 1,
                            "shadow": null,
                            "visible": true,
                            "backgroundColor": "",
                            "fillRule": "nonzero",
                            "paintFirst": "fill",
                            "globalCompositeOperation": "source-over",
                            "skewX": 0,
                            "skewY": 0,
                            "path": [
                                [
                                    "M",
                                    869.497,
                                    123
                                ],
                                [
                                    "Q",
                                    869.5,
                                    123,
                                    870,
                                    123
                                ],
                                [
                                    "Q",
                                    870.5,
                                    123,
                                    871,
                                    123
                                ],
                                [
                                    "Q",
                                    871.5,
                                    123,
                                    872.5,
                                    123
                                ],
                                [
                                    "Q",
                                    873.5,
                                    123,
                                    874,
                                    123
                                ],
                                [
                                    "Q",
                                    874.5,
                                    123,
                                    875.5,
                                    122.5
                                ],
                                [
                                    "Q",
                                    876.5,
                                    122,
                                    877.5,
                                    122
                                ],
                                [
                                    "Q",
                                    878.5,
                                    122,
                                    879.5,
                                    121.5
                                ],
                                [
                                    "Q",
                                    880.5,
                                    121,
                                    881,
                                    121
                                ],
                                [
                                    "Q",
                                    881.5,
                                    121,
                                    882,
                                    120.5
                                ],
                                [
                                    "Q",
                                    882.5,
                                    120,
                                    883.5,
                                    119.5
                                ],
                                [
                                    "Q",
                                    884.5,
                                    119,
                                    885,
                                    119
                                ],
                                [
                                    "Q",
                                    885.5,
                                    119,
                                    886.5,
                                    118
                                ],
                                [
                                    "Q",
                                    887.5,
                                    117,
                                    888,
                                    116.5
                                ],
                                [
                                    "Q",
                                    888.5,
                                    116,
                                    888.5,
                                    115.5
                                ],
                                [
                                    "Q",
                                    888.5,
                                    115,
                                    889,
                                    114
                                ],
                                [
                                    "Q",
                                    889.5,
                                    113,
                                    889.5,
                                    112.5
                                ],
                                [
                                    "Q",
                                    889.5,
                                    112,
                                    889.5,
                                    111.5
                                ],
                                [
                                    "Q",
                                    889.5,
                                    111,
                                    889.5,
                                    110.5
                                ],
                                [
                                    "Q",
                                    889.5,
                                    110,
                                    889.5,
                                    109.5
                                ],
                                [
                                    "Q",
                                    889.5,
                                    109,
                                    889,
                                    108.5
                                ],
                                [
                                    "Q",
                                    888.5,
                                    108,
                                    888,
                                    108
                                ],
                                [
                                    "Q",
                                    887.5,
                                    108,
                                    886.5,
                                    108
                                ],
                                [
                                    "Q",
                                    885.5,
                                    108,
                                    885,
                                    108
                                ],
                                [
                                    "Q",
                                    884.5,
                                    108,
                                    883,
                                    107.5
                                ],
                                [
                                    "Q",
                                    881.5,
                                    107,
                                    881,
                                    107
                                ],
                                [
                                    "Q",
                                    880.5,
                                    107,
                                    879,
                                    106.5
                                ],
                                [
                                    "Q",
                                    877.5,
                                    106,
                                    877,
                                    106
                                ],
                                [
                                    "Q",
                                    876.5,
                                    106,
                                    876,
                                    106
                                ],
                                [
                                    "Q",
                                    875.5,
                                    106,
                                    874,
                                    105.5
                                ],
                                [
                                    "Q",
                                    872.5,
                                    105,
                                    872,
                                    105
                                ],
                                [
                                    "Q",
                                    871.5,
                                    105,
                                    871,
                                    104.5
                                ],
                                [
                                    "Q",
                                    870.5,
                                    104,
                                    870,
                                    104
                                ],
                                [
                                    "Q",
                                    869.5,
                                    104,
                                    869,
                                    104
                                ],
                                [
                                    "Q",
                                    868.5,
                                    104,
                                    868,
                                    104.5
                                ],
                                [
                                    "Q",
                                    867.5,
                                    105,
                                    867,
                                    105.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    106,
                                    866.5,
                                    106.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    107,
                                    866.5,
                                    107.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    108,
                                    866.5,
                                    108.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    109,
                                    866.5,
                                    109.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    110,
                                    866.5,
                                    110.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    111,
                                    866.5,
                                    111.5
                                ],
                                [
                                    "Q",
                                    866.5,
                                    112,
                                    866,
                                    113
                                ],
                                [
                                    "Q",
                                    865.5,
                                    114,
                                    865.5,
                                    114.5
                                ],
                                [
                                    "Q",
                                    865.5,
                                    115,
                                    865.5,
                                    115.5
                                ],
                                [
                                    "Q",
                                    865.5,
                                    116,
                                    865,
                                    116.5
                                ],
                                [
                                    "Q",
                                    864.5,
                                    117,
                                    864.5,
                                    117.5
                                ],
                                [
                                    "Q",
                                    864.5,
                                    118,
                                    864.5,
                                    118.5
                                ],
                                [
                                    "Q",
                                    864.5,
                                    119,
                                    864.5,
                                    119.5
                                ],
                                [
                                    "Q",
                                    864.5,
                                    120,
                                    864.5,
                                    120.5
                                ],
                                [
                                    "Q",
                                    864.5,
                                    121,
                                    865,
                                    121
                                ],
                                [
                                    "Q",
                                    865.5,
                                    121,
                                    865.5,
                                    121.5
                                ],
                                [
                                    "Q",
                                    865.5,
                                    122,
                                    866,
                                    122
                                ],
                                [
                                    "Q",
                                    866.5,
                                    122,
                                    867,
                                    122
                                ],
                                [
                                    "Q",
                                    867.5,
                                    122,
                                    868,
                                    122
                                ],
                                [
                                    "Q",
                                    868.5,
                                    122,
                                    869,
                                    122
                                ],
                                [
                                    "Q",
                                    869.5,
                                    122,
                                    870,
                                    122.5
                                ],
                                [
                                    "Q",
                                    870.5,
                                    123,
                                    871,
                                    123
                                ],
                                [
                                    "Q",
                                    871.5,
                                    123,
                                    872.5,
                                    123.5
                                ],
                                [
                                    "L",
                                    873.503,
                                    124.003
                                ]
                            ]
                        },
                        {
                            "type": "textbox",
                            "version": "5.3.0",
                            "originX": "left",
                            "originY": "top",
                            "left": 343.5,
                            "top": 51,
                            "width": 70.51,
                            "height": 45.2,
                            "fill": "#ff0000",
                            "stroke": "#ff0000",
                            "strokeWidth": 1,
                            "strokeDashArray": null,
                            "strokeLineCap": "butt",
                            "strokeDashOffset": 0,
                            "strokeLineJoin": "miter",
                            "strokeUniform": false,
                            "strokeMiterLimit": 4,
                            "scaleX": 1,
                            "scaleY": 1,
                            "angle": 0,
                            "flipX": false,
                            "flipY": false,
                            "opacity": 1,
                            "shadow": null,
                            "visible": true,
                            "backgroundColor": "",
                            "fillRule": "nonzero",
                            "paintFirst": "fill",
                            "globalCompositeOperation": "source-over",
                            "skewX": 0,
                            "skewY": 0,
                            "fontFamily": "Times New Roman",
                            "fontWeight": "normal",
                            "fontSize": 40,
                            "text": "Text",
                            "underline": false,
                            "overline": false,
                            "linethrough": false,
                            "textAlign": "left",
                            "fontStyle": "normal",
                            "lineHeight": 1.16,
                            "textBackgroundColor": "",
                            "charSpacing": 0,
                            "styles": [],
                            "direction": "ltr",
                            "path": null,
                            "pathStartOffset": 0,
                            "pathSide": "left",
                            "pathAlign": "baseline",
                            "minWidth": 20,
                            "splitByGrapheme": false
                        }
                    ]
                },
                "canvasBoundingClientRect": {
                    "width": 1020,
                    "height": 1320
                }
            }
        },
        canvasObjSelectionState: false,
        fabricCanvas: {},
        pdfAsset: [
            {
                id: 'test1-5646545',
                url: this.BASE_URL + '/pdfjs/test1.pdf',
                name: 'test1.pdf'
            },

            {
                id: 'test2-sfegge',
                url: this.BASE_URL + '/pdfjs/test2.pdf',
                name: 'test2.pdf'
            },

            {
                id: 'test3-brehtehs',
                url: this.BASE_URL + '/pdfjs/test3.pdf',
                name: 'test3.pdf'
            },
        ],
        viewerApp: null,
        viewer: null,
        currentOpenPDF: null,
        JpDocumentMessageRoot: null
    }


    updateAnnotationIconConfig(value) {
        const temp = this.annotationIconConfig
        if (value.pdfAsset !== undefined) {
            if (value.pdfAsset.id !== null && value.pdfAsset.value === null) {
                temp.pdfAsset = temp.pdfAsset.filter(item => item.id !== value.pdfAsset.id)
            }

            if (value.pdfAsset.id === null && value.pdfAsset.value !== null) {
                temp.pdfAsset.push({
                    ...value.pdfAsset.value,
                    id: 'Jp' + uuidv4()
                })
            }

        }

        if (value.canvasBoundingClientRect !== undefined) {
            temp.canvasBoundingClientRect = value.canvasBoundingClientRect
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

            if (temp.history[value.history.pdfID]['canvasBoundingClientRect'] === undefined) {
                temp.history[value.history.pdfID]['canvasBoundingClientRect'] = {
                    width: this.annotationIconConfig.canvasBoundingClientRect.width,
                    height: this.annotationIconConfig.canvasBoundingClientRect.height,
                }
            }

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
    }

    updateAppCompOpenConfig(value) {
        const temp = _.cloneDeep(this.appCompOpenConfig)
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


            // console.log(_.cloneDeep(this.documentsGroup), 'documentsGroup')


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


