import Header from "editorjs-header-with-alignment";
import SimpleImage from "@editorjs/simple-image";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "editorjs-table";
import EditorJS from "@editorjs/editorjs";
import CodeTool from '@editorjs/code';
import AttachesTool from '@editorjs/attaches';
import RawTool from '@editorjs/raw';
import Alert from 'editorjs-alert';
import Paragraph from 'editorjs-paragraph-with-alignment';
import ColorPlugin from 'editorjs-text-color-plugin';
import {useStore} from "../../stores";



import _ from 'lodash'

const useMarkdownHooks = () => {

    const {commonStore} = useStore()


    const editorConfig = {
        /**
         * Enable/Disable the read only mode
         */
        readOnly: false,

        /**
         * Wrapper of Editor
         */
        holder: 'editorjs',

        /**
         * Tools list
         */
        tools: {
            /**
             * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
             */


            Color: {
                class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                config: {
                    colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
                    defaultColor: '#FF1300',
                    type: 'text',
                    customPicker: true // add a button to allow selecting any colour
                }
            },
            Marker: {
                class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                config: {
                    defaultColor: '#FFBF00',
                    type: 'marker',
                    icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
                }
            },


            paragraph: {
                class: Paragraph,
                inlineToolbar: true,
            },

            header: {
                class: Header,
                inlineToolbar: ['link'],
                config: {
                    placeholder: 'Header'
                },
                shortcut: 'CMD+SHIFT+H'
            },

            /**
             * Or pass class directly without any configuration
             */
            image: SimpleImage,

            list: {
                class: NestedList,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+L'
            },

            checklist: {
                class: Checklist,
                inlineToolbar: true,
            },

            quote: {
                class: Quote,
                inlineToolbar: true,
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author',
                },
                shortcut: 'CMD+SHIFT+O'
            },

            alert: Alert,



            delimiter: Delimiter,

            inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+SHIFT+C'
            },

            // linkTool: LinkTool,

            code: CodeTool,

            embed: Embed,
            raw: RawTool,

            table: {
                class: Table,
                inlineToolbar: true,
                shortcut: 'CMD+ALT+T'
            },


            attaches: {
                class: AttachesTool,
                config: {
                    /**
                     * Custom uploader
                     */
                    uploader: {
                        /**
                         * Upload file to the server and return an uploaded image data
                         * @param {File} file - file selected from the device or pasted by drag-n-drop
                         * @return {Promise.<{success, file: {url}}>}
                         */
                        uploadByFile(file) {
                            // your own uploading logic here
                            return new Promise((resolve, reject) => {
                                // 异步操作
                                let condition = true; // 假设这是某个异步操作的条件
                                if (condition) {


                                    const reader = new FileReader();

                                    // 定义文件读取成功后的回调函数
                                    reader.onload = function (e) {
                                        // e.target.result包含了转换为Base64的文件内容
                                        // console.log('文件的Base64 URL:', e.target.result);

                                        resolve({
                                            fileurl: e.target.result,
                                            title:file.name,
                                            name:file.name,
                                            size:file.size,
                                        }); // 如果操作成功，调用 resolve 并传递结果
                                    };
                                    // 使用readAsDataURL方法读取选中的文件
                                    reader.readAsDataURL(file);

                                } else {
                                    reject('操作失败'); // 如果操作失败，调用 reject 并传递错误信息
                                }
                            }).then((response) => {

                                // console.log(response, 'response')

                                return {
                                    success: 1,
                                    file: {
                                        url: response.fileurl,
                                        title:response.name,
                                        size:response.size,
                                        name:response.name,
                                    }
                                };
                            });
                        },
                    },


                    additionalRequestHeaders: {

                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"

                    }
                }
            }


        },


        data: {}
    }

    const getNewEditorJS = (editorJSOnReady=()=>{}) => {

        const parentNode = document.getElementById('editorjs');
        while (parentNode?.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }


        const editorJS = new EditorJS({
            ...editorConfig,
            onChange: (e => {
                commonStore.setIsDocumentsGroupDataUpdate(true)


                // console.log(e, 'editorConfig')
            }),

            onReady() {
                // console.log('EditorJS ok')
                editorJSOnReady()
            }

        })


        commonStore.updateMarkdownObj(editorJS)
    }
    const updateMarkdownData = (value, editorJSOnReady=()=>{}) => {
        editorConfig['data'] = value
        getNewEditorJS(editorJSOnReady)
    }


    return {updateMarkdownData}

}

export default useMarkdownHooks