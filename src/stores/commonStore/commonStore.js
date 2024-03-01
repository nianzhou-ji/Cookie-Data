import {makeAutoObservable} from "mobx";
import _ from 'lodash'
import indexedDBEngine from "../../indexDBUtils/indexDBUtils";

class CommonStore {

    documentsGroup = []

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

    updateDocumentsGroup(value){
        this.documentsGroup =  value
    }

    downloadMarkdown() {
        const obj  = this.getCurrentDocumentObj()

        // 创建一个新的 Blob 对象，内容为 Markdown 文本
        const blob = new Blob([obj.content], { type: 'text/markdown;charset=utf-8' });

        // 创建一个指向 Blob 对象的 URL
        const url = URL.createObjectURL(blob);

        // 创建一个临时的 a 标签用于下载
        const a = document.createElement('a');
        a.href = url;
        a.download = obj.name+'.md';

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }



    async initDocumentsGroup(){
        await indexedDBEngine.open()
        const res = await indexedDBEngine.get(1)

        if(res===undefined)return

        this.updateDocumentsGroup(res.documentsGroup)

        if(res.documentsGroup!==undefined && res.documentsGroup.length>0){
            this.updateCurrentDocumentID(res.documentsGroup[0].id)
        }



    }


    async saveIndexedDB   () {
        let state = true
        try {
            await indexedDBEngine.open()

            await indexedDBEngine.patch({
                id: 1,
                documentsGroup: _.cloneDeep(this.documentsGroup)
            })

        } catch (e) {
            state = false
        }

        return state
    }


    deleteDocumentsGroup(id) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        this.documentsGroup = tempObj.filter(item => item.id !== id)
    }

    currentDocumentID = ''


    patchDocumentsGroup(content) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        const res = tempObj.find(item => item.id === this.currentDocumentID)
        if (res !== undefined) {
            res.content = content
            this.documentsGroup = tempObj
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


