import {makeAutoObservable} from "mobx";
import _ from 'lodash'
import indexedDBEngine from "../indexDBUtils/indexDBUtils";
import Utils from "../utils";


class CommonStore {

    secondsToHMS(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // 使输出格式为两位数，例如：05:08:09
        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
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


    VERSION = 'V1.2'


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
                const snapshot = this.processDrawObj.store.getSnapshot()
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


