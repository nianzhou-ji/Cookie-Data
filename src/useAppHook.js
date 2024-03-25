import _ from "lodash";
import {useStore} from "./stores";
import useMarkdownHooks from "./components/MarkdownComp/useMarkdownHooks";

const useAppHook = () => {
    const {commonStore} = useStore()
    const {updateMarkdownData} = useMarkdownHooks()


    const initInterfaceData = async (editorJSOnReady=()=>{}) => {
        try {

            if (commonStore.documentsGroup.length === 0) {
                commonStore.updateAppCompOpenConfig({
                    markdownAppOpen: false,
                    processAppOpen: false,
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


    return {initInterfaceData}

}

export default useAppHook