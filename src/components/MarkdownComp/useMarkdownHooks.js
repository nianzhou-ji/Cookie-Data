import Header from "@editorjs/header";
import SimpleImage from "@editorjs/simple-image";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import EditorJS from "@editorjs/editorjs";
import CodeTool from '@editorjs/code';
import RawTool from '@editorjs/raw';
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
            header: {
                class: Header,
                inlineToolbar: ['marker', 'link'],
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

            warning: Warning,

            marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M'
            },


            delimiter: Delimiter,

            inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+SHIFT+C'
            },

            linkTool: LinkTool,

            code: CodeTool,

            embed: Embed,
            raw: RawTool,

            table: {
                class: Table,
                inlineToolbar: true,
                shortcut: 'CMD+ALT+T'
            },

        },


        data:{}
    }

    const getNewEditorJS = () => {

        const parentNode = document.getElementById('editorjs');
        while (parentNode?.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }


        const editorJS = new EditorJS({
            ...editorConfig,
            onChange: (e => {
                commonStore.setIsDocumentsGroupDataUpdate(true)
            })

        })


        commonStore.updateMarkdownObj(editorJS)
    }
    const updateMarkdownData = (value) => {
        editorConfig['data'] = value
        getNewEditorJS()
    }


    return {updateMarkdownData}

}

export default useMarkdownHooks