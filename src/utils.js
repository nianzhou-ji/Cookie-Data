class Utils {

   static secondsToHMS(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // 使输出格式为两位数，例如：05:08:09
        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }


    static formatTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}__${hours}-${minutes}-${seconds}`;
    }

    static getJSDateObjFromBackend(dateTimeString) {

        const [datePart, timePart] = dateTimeString.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hour, minute, second] = timePart.split(":");
        return new Date(year, month - 1, day, hour, minute, second);
    }


    static setElementDisabled(id, state) {
        try {
            const element = document.getElementById(id);
            if (element === undefined) return

            if (state) {
                element.style.backgroundColor = "#AFAFAF";
                element.style.pointerEvents = "none";
            } else {
                element.style.backgroundColor = "#FFF";
                element.style.pointerEvents = "auto";
            }
        } catch (e) {

        }

    }


    static blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    static async convertMp4ToBlob(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error converting MP4 to Blob:', error);
        }
    }
}

export default Utils