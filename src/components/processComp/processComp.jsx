import React, {useCallback, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import _ from 'lodash'
import {Tldraw} from "@tldraw/tldraw";
import 'tldraw/tldraw.css'
import {getAssetUrls} from '@tldraw/assets/selfHosted'


const ProcessComp = ({className}) => {


    const {commonStore} = useStore()


    const [processDrawObj, setProcessDrawObj] = useState(null);
    const [assetUrls, setAssetUrls] = useState({});


    useEffect(() => {
        commonStore.updateProcessDrawObj(processDrawObj)
    }, [processDrawObj]);

    const setAppToState = useCallback((editor) => {
        setProcessDrawObj(editor)
        const handleChangeEvent = (change) => {

            editor.updateInstanceState({ isFocused: true })


            // Added
            for (const record of Object.values(change.changes.added)) {
                if (record.typeName === 'shape') {
                    console.log('Added shape')
                    commonStore.setIsDocumentsGroupDataUpdate(true)
                }
            }
            // Updated
            for (const [from, to] of Object.values(change.changes.updated)) {
                if (from.typeName === 'instance' && to.typeName === 'instance' && from.currentPageId !== to.currentPageId) {
                    console.log('changed page ')
                    commonStore.setIsDocumentsGroupDataUpdate(true)
                } else if (from.id.startsWith('shape') && to.id.startsWith('shape')) {
                    console.log('updated shape')
                    commonStore.setIsDocumentsGroupDataUpdate(true)
                }
            }
            // Removed
            for (const record of Object.values(change.changes.removed)) {
                if (record.typeName === 'shape') {
                    console.log('deleted shape')
                    commonStore.setIsDocumentsGroupDataUpdate(true)
                }
            }
        };
        // editor.store.listen(handleChangeEvent, {source: 'user', scope: 'all'});
        editor.store.listen(handleChangeEvent);


        console.log(_.eq(commonStore.processDrawObj, editor), 'compare')
    }, []);


    useEffect(() => {
        setAssetUrls(getAssetUrls(
            {
                baseUrl: 'http://localhost:8082/assets/tldraw'
            }
        ))
    }, []);

    const [storeEvents, setStoreEvents] = useState([]);

    // useEffect(() => {
    //     if (!editor) return;
    //
    //
    //     commonStore.updateProcessDrawObj(editor)
    //
    //     function logChangeEvent(eventName) {
    //         setStoreEvents((events) => [...events, eventName]);
    //         commonStore.setIsDocumentsGroupDataUpdate(true)
    //     }
    //
    //     //[1]
    //     const handleChangeEvent = (change) => {
    //         // Added
    //         for (const record of Object.values(change.changes.added)) {
    //             if (record.typeName === 'shape') {
    //                 logChangeEvent(`created shape (${record.type})\n`);
    //             }
    //         }
    //
    //         // Updated
    //         for (const [from, to] of Object.values(change.changes.updated)) {
    //             if (
    //                 from.typeName === 'instance' &&
    //                 to.typeName === 'instance' &&
    //                 from.currentPageId !== to.currentPageId
    //             ) {
    //                 logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`);
    //             } else if (from.id.startsWith('shape') && to.id.startsWith('shape')) {
    //                 logChangeEvent(`updated shape (${JSON.stringify('diff')})\n`);
    //             }
    //         }
    //
    //         // Removed
    //         for (const record of Object.values(change.changes.removed)) {
    //             if (record.typeName === 'shape') {
    //                 logChangeEvent(`deleted shape (${record.type})\n`);
    //             }
    //         }
    //     };
    //
    //     // [2]
    //     const cleanupFunction = editor.store.listen(handleChangeEvent, {
    //         source: 'user',
    //         scope: 'all'
    //     });
    //
    //
    //     return () => {
    //         cleanupFunction();
    //     };
    // }, [editor]);

    return (
        <div
            className={`flex-grow  h-full ${commonStore.documentsGroup.length > 0 && commonStore.appCompOpenConfig.processAppOpen ? null : 'hidden'}`}
            style={{
                overflow: "auto",
                // backgroundColor:'blue'
            }}>
            <div style={{width: '100%', height: '100%'}} className="tldraw__editor">
                <Tldraw onMount={setAppToState} assetUrls={assetUrls}/>
                {/*<Tldraw onMount={setAppToState}/>*/}
            </div>
        </div>
    )
};

export default observer(ProcessComp);
