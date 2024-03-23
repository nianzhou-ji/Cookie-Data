import {makeAutoObservable} from "mobx";
import _ from 'lodash'
import indexedDBEngine from "../../indexDBUtils/indexDBUtils";
import {value} from "lodash/seq";

class CommonStore {

    VERSION = 'V1.0'


    addDocumentName='default'


    updateAddDocumentName(value){
        this.addDocumentName = value
    }


    appCompOpenConfig = {
        markdownAppOpen: true,
        processAppOpen: false,
    }

    updateAppCompOpenConfig(value) {
        const temp = _.cloneDeep(this.appCompOpenConfig)
        if (value.markdownAppOpen !== undefined) {
            temp.markdownAppOpen = value.markdownAppOpen
        }

        if (value.processAppOpen !== undefined) {
            temp.processAppOpen = value.processAppOpen
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

    formatTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}__${hours}-${minutes}-${seconds}`;
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
        a.download = this.formatTime(new Date()) + '_backup.json';

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    parsingBackupData(files) {
        let resTemp = [];

        // 获取选中的所有文件
        var filesArray = Array.from(files);

        // 按照文件的最后修改时间进行排序
        filesArray.sort(function (a, b) {
            return a.lastModified - b.lastModified;
        });


        // 在控制台打印排序后的文件名和最后修改时间
        // filesArray.forEach(function(file) {
        //     console.log("File: " + file.name + ", Last Modified: " + new Date(file.lastModified));
        // });

        async function readFiles(filesArray) {
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

                        reader.onerror = function (error) {
                            reject(error); // 文件读取失败，拒绝 Promise
                        };

                        reader.readAsText(file);
                    });
                };

                // 等待文件读取完成
                await readFile(file);
                // console.log(new Date(file.lastModified))
            }


            return resTemp
        }

        readFiles(filesArray).then((resTemp) => {
            // console.log('所有文件读取完成', resTemp);
            this.updateDocumentsGroup(this.mergeArrays(resTemp))
            alert('import backup data success')

            if (this.documentsGroup !== undefined && this.documentsGroup.length > 0) {
                this.updateCurrentDocumentID(this.documentsGroup[0].id)
            }
        }).catch((error) => {
            console.error('读取文件时发生错误:', error);
        });
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


    async initDocumentsGroup() {
        await indexedDBEngine.open()
        const res = await indexedDBEngine.get(1)

        if (res === undefined) return
        res.documentsGroup = JSON.parse(res.documentsGroup)

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
                this.patchDocumentsGroup(JSON.stringify(snapshot), 'processData')
            }

            // console.log(_.cloneDeep(this.documentsGroup), 'documentsGroup')


            await indexedDBEngine.open()

            await indexedDBEngine.patch({
                id: 1,
                documentsGroup: JSON.stringify(this.documentsGroup)
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
        return this.documentsGroup.find(item => item.id === this.currentDocumentID)
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


