class Utils {


    static     getContainerSize = (id) => {
        return document.getElementById(id)?.getBoundingClientRect()
    }


    static prefixClassNames(classString) {
        // 分割字符串成数组
        const classes = classString.split(' ');
        // 为每个类添加前缀
        const prefixedClasses = classes.map(className => {
            let noSpaces = className.replace(/\s+/g, '');
            if (noSpaces.length !== 0) {
                return `JpTw-${className}`
            }
            return null

        });
        // 将数组合并为一个字符串，每个元素之间用空格分隔
        return prefixedClasses.join(' ');
    }

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

    static removeElementById(elementId, rootContainer) {
        // 获取元素
        const element = rootContainer.getElementById(elementId);

        // 确保元素存在
        if (element) {
            // 从其父元素中删除该元素
            element.parentNode.removeChild(element);
        } else {
            console.log("Element not found!");
        }
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


    static      getAbbreviateStr = (str, maxLength = 10) => {
        try {
            if (str.length > maxLength) {
                return {
                    text: str.substring(0, maxLength) + '...',
                    tooltip: str
                }
            } else {
                return {
                    text: str,
                    tooltip: null
                }
            }
        } catch (e) {
            return {
                text: null,
                tooltip: null
            }
        }


    }

    static async urlToBase64(url) {
        try {
            // 使用 Fetch API 获取远程资源
            const response = await fetch(url);
            const blob = await response.blob();

            // 创建一个 FileReader 对象
            const reader = new FileReader();

            // 将读取完成事件封装为 Promise
            const loadPromise = new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
            });

            // 读取 Blob 对象
            reader.readAsDataURL(blob);

            // 等待读取完成并返回 Base64 数据
            const base64Data = await loadPromise;
            return base64Data;
        } catch (error) {
            console.error('Error fetching and converting PDF:', error);
            throw error;
        }
    }


    static async urlToUint8Array(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        } catch (error) {
            console.error('Error fetching and converting the data:', error);
        }
    }
}

export default Utils
