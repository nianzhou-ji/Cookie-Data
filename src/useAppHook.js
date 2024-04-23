import _ from "lodash";
import {useStore} from "./stores";
import useMarkdownHooks from "./components/MarkdownComp/useMarkdownHooks";
import Utils from "./utils";

const useAppHook = () => {
    const {commonStore} = useStore()
    const {updateMarkdownData} = useMarkdownHooks()

    const buttonGroupID = ['AddIconID', 'DeleteIconID', 'MarkDownIconID', 'DrawIConID', 'DocumentsIconID',
        'SaveIconID', 'BackupIconID', 'ImportBackupDataIconID']


    const initAppIconState=()=>{
        if (commonStore.documentsGroup.length === 0) {
            buttonGroupID.forEach(item => {
                if (!['AddIconID', 'ImportBackupDataIconID'].includes(item)) {
                    Utils.setElementDisabled(item, true)
                }
            })
        } else {
            buttonGroupID.forEach(item => {
                Utils.setElementDisabled(item, false)
            })
        }
    }


    const initInterfaceData = async (editorJSOnReady=()=>{}) => {
        try {

            if (commonStore.documentsGroup.length === 0) {
                commonStore.updateAppCompOpenConfig({
                    errorPageAppOpen:true,
                    toolboxAppOpen:false,
                    markdownAppOpen: false,
                    processAppOpen: false,
                    PDFReaderAppOpen:false

                })

                return
            }

            const currentObj = commonStore.getCurrentDocumentObj()
            if (currentObj === null) {
                return {state: false, error: 'not find data'}
            }

            updateMarkdownData(currentObj.markdownData, editorJSOnReady)
            commonStore.processDrawObj.store.loadSnapshot(currentObj.processData)
            // commonStore.processDrawObj.store.loadSnapshot(JSON.stringify(currentObj.processData))
            return {state: true}

        } catch (e) {
            return {state: false, error: e}
        }

    }


    return {initInterfaceData, initAppIconState, buttonGroupID}

}

export default useAppHook
