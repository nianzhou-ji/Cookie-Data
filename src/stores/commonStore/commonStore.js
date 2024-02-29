import {makeAutoObservable} from "mobx";
import _ from 'lodash'

class CommonStore {

    documentsGroup = []

    addDocumentsGroup(value) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        tempObj.push(value)
        this.documentsGroup = tempObj
    }

    deleteDocumentsGroup(id) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        this.documentsGroup = tempObj.filter(item => item.id !== id)
    }


    currentDocumentID = '456489'
    currentDocumentIsSaved = true

    updateCurrentDocumentIsSaved(value) {
        this.currentDocumentIsSaved = value

    }


    patchDocumentsGroup(content) {
        const tempObj = _.cloneDeep(this.documentsGroup)
        const res = tempObj.find(item => item.id === this.currentDocumentID)
        if (res !== undefined) {
            res.content = content
            this.documentsGroup = tempObj
            this.updateCurrentDocumentIsSaved(false)

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


