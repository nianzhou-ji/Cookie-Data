import React, {useCallback, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import _ from 'lodash'
import {Tldraw} from "tldraw";


const ProcessComp = ({className}) => {
    const {commonStore} = useStore()


    const [editor, setEditor] = useState();

    const setAppToState = useCallback((editor) => {
        setEditor(editor);
    }, []);

    const [storeEvents, setStoreEvents] = useState([]);

    useEffect(() => {
        if (!editor) return;


        commonStore.updateProcessDrawObj(editor)

        function logChangeEvent(eventName) {
            setStoreEvents((events) => [...events, eventName]);
            commonStore.setIsDocumentsGroupDataUpdate(true)
        }

        //[1]
        const handleChangeEvent = (change) => {
            // Added
            for (const record of Object.values(change.changes.added)) {
                if (record.typeName === 'shape') {
                    logChangeEvent(`created shape (${record.type})\n`);
                }
            }

            // Updated
            for (const [from, to] of Object.values(change.changes.updated)) {
                if (
                    from.typeName === 'instance' &&
                    to.typeName === 'instance' &&
                    from.currentPageId !== to.currentPageId
                ) {
                    logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`);
                } else if (from.id.startsWith('shape') && to.id.startsWith('shape')) {
                    logChangeEvent(`updated shape (${JSON.stringify('diff')})\n`);
                }
            }

            // Removed
            for (const record of Object.values(change.changes.removed)) {
                if (record.typeName === 'shape') {
                    logChangeEvent(`deleted shape (${record.type})\n`);
                }
            }
        };

        // [2]
        const cleanupFunction = editor.store.listen(handleChangeEvent, {
            source: 'user',
            scope: 'all'
        });

        return () => {
            cleanupFunction();
        };
    }, [editor]);

    return (
        <div className={`mt-3 ${commonStore.appCompOpenConfig.processAppOpen ? null : 'hidden'}`} style={{
            height: '92vh',
            overflow: "auto",
            // backgroundColor:'blue'
        }}>
            <div style={{width: '100%', height: '100%'}}>
                <Tldraw onMount={setAppToState}/>
            </div>
            <div className='hidden'
                 onCopy={(event) => event.stopPropagation()}
            >
            </div>


            <button className='hidden'
                    onClick={() => {
                        const snapshot = editor.store.getSnapshot()
                        const stringified = JSON.stringify(snapshot)
                        console.log(stringified, 'stringified')
                    }}
            >
                Save
            </button>
        </div>
    )
};

export default observer(ProcessComp);
