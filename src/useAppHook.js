import _ from "lodash";
import {useStore} from "./stores";
import useMarkdownHooks from "./components/MarkdownComp/useMarkdownHooks";
import Swal from "sweetalert2";

const useAppHook = () => {
    const {commonStore} = useStore()
    const {updateMarkdownData} = useMarkdownHooks()


    const initInterfaceData = async () => {
        try {

            if (commonStore.documentsGroup.length === 0) {
                commonStore.updateAppCompOpenConfig({
                    markdownAppOpen: false,
                    processAppOpen: false,
                })

                return
            }

            const currentObj = _.cloneDeep(commonStore.documentsGroup.find(item => item.id === commonStore.currentDocumentID))
            if (currentObj === undefined) {
                return {state: false, error: 'not find data'}
            }

            updateMarkdownData(currentObj.markdownData)
            commonStore.processDrawObj.store.loadSnapshot(JSON.parse(currentObj.processData))
            return {state: true}

        } catch (e) {
            return {state: false, error: e}
        }

    }


    return {initInterfaceData}

}

export default useAppHook