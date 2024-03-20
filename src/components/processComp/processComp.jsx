import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Excalidraw} from "@excalidraw/excalidraw";
import {useStore} from "../../stores";
import MDEditor from "@uiw/react-md-editor";
import _ from 'lodash'

const ProcessComp = ({className}) => {

    const {commonStore} = useStore()
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    return (
        <div className={className}>
            <Excalidraw excalidrawAPI={api => setExcalidrawAPI(api)}
                        initialData={commonStore.getCurrentDocumentObj()?.excalidrawSceneData}

                        onPointerDown={(activeTool, pointerDownState) => {
                            // console.log(activeTool, pointerDownState)
                            const currentDocumentObj = commonStore.getCurrentDocumentObj()
                            if (currentDocumentObj.excalidrawSceneData !== undefined) {
                                if (_.isEqual(excalidrawAPI.getSceneElements(), _.cloneDeep(currentDocumentObj.excalidrawSceneData.elements))) {
                                    // console.log('没有修改', excalidrawAPI.getSceneElements(), _.cloneDeep(currentDocumentObj.excalidrawSceneData.elements))
                                } else {
                                    // console.log('有修改', excalidrawAPI.getSceneElements(), _.cloneDeep(currentDocumentObj.excalidrawSceneData.elements))
                                    commonStore.setIsDocumentsGroupDataUpdate(true)

                                }
                            }
                        }}

            />

            <button id={'excalidrawAPISaveSceneData'} className='hidden'
                    onClick={() => commonStore.patchDocumentsGroup({
                        elements: excalidrawAPI.getSceneElements(),
                        appState: excalidrawAPI.getAppState(),
                        files: excalidrawAPI.getFiles(),
                    }, 'excalidrawSceneData')}></button>


            <button id={'excalidrawAPIUpdateSceneData'} className='hidden'
                    onClick={() => {
                        try {

                            const currentDocumentObj = commonStore.getCurrentDocumentObj()

                            if (currentDocumentObj.excalidrawSceneData === undefined) {
                                excalidrawAPI.updateScene({
                                    elements: [],
                                    appState: {},
                                    files: {},
                                })
                            } else {
                                excalidrawAPI.updateScene(currentDocumentObj.excalidrawSceneData)
                            }
                        } catch (error) {
                            console.log(error)
                        }

                    }

                    }/>


        </div>
    );
};

export default observer(ProcessComp);
