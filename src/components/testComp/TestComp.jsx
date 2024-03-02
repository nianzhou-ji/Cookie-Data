import React, {useState} from 'react';
import {observer} from "mobx-react-lite"
import {useStore} from "../../stores";

import '@mdxeditor/editor/style.css'
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    BlockTypeSelect,
    CreateLink,
    InsertCodeBlock,
    tablePlugin,
    InsertTable,
    linkPlugin,
    ALL_HEADING_LEVELS,
    markdownShortcutPlugin, ListsToggle
} from '@mdxeditor/editor'

import {UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'

const TestComp = () => {
    const {commonStore} = useStore()
    return (
        <div className='p-3'>
            <MDXEditor
                markdown="Hello world"
                plugins={[
                    tablePlugin(),
                    linkPlugin(),
                    headingsPlugin(), listsPlugin(), linkPlugin(), quotePlugin(), markdownShortcutPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                {' '}
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <InsertTable />
                                <ListsToggle />
                                <BlockTypeSelect />




                            </>
                        )
                    })





                ]}
            />
        </div>
    )
}

export default observer(TestComp);