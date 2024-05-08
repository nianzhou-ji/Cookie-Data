import Swal from "sweetalert2";
import {useStore} from "../stores";

export const useCommonHooks = () => {

    const {commonStore} = useStore()

    const saveData = async (title) => {
        const res = await commonStore.saveIndexedDB()
        if (res.state) {
            // Swal.close()
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: title,
                showConfirmButton: false,
                timer: 1500
            });
            commonStore.setIsDocumentsGroupDataUpdate(false)


        } else {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.error
            });
        }
    }

    return {saveData}


}
