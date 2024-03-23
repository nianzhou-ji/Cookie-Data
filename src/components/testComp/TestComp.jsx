import _ from 'lodash'
import {useCallback, useEffect, useState} from 'react'
import {Editor, TLEventMapHandler, Tldraw} from 'tldraw'
import 'tldraw/tldraw.css'

const TestComp = () => {

    const [editor, setEditor] = useState();

    const setAppToState = useCallback((editor) => {
        setEditor(editor);
    }, []);

    const [storeEvents, setStoreEvents] = useState([]);

    useEffect(() => {
        if (!editor) return;

        function logChangeEvent(eventName) {
            setStoreEvents((events) => [...events, eventName]);
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
                    // let diff = _.reduce(
                    //     from,
                    //     (result, value, key) =>
                    //         _.isEqual(value, to[key]) ? result : result.concat([key, to[key]]),
                    //     []
                    // );
                    // if (diff?.[0] === 'props') {
                    //     diff = _.reduce(
                    //         from.props,
                    //         (result, value, key) =>
                    //             _.isEqual(value, to.props[key])
                    //                 ? result
                    //                 : result.concat([key, to.props[key]]),
                    //         []
                    //     );
                    // }
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
        <div style={{display: 'flex'}}>
            <div style={{width: '60vw', height: '100vh'}}>
                <Tldraw onMount={setAppToState}/>
            </div>
            <div

                onCopy={(event) => event.stopPropagation()}
            >
            </div>


            <button
                onClick={() => {
                    const snapshot = editor.store.getSnapshot()
                    const stringified = JSON.stringify(snapshot)
                    // console.log(stringified, 'stringified')
                }}
            >
                Save
            </button>
        </div>
    )

}

export default TestComp;