import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import {Excalidraw} from "@excalidraw/excalidraw";
import {useStore} from "../../stores";
import MDEditor from "@uiw/react-md-editor";

const ProcessComp = ({className}) => {

    const {commonStore} = useStore()
    const currentDocumentObj = commonStore.getCurrentDocumentObj()

    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    return (
        <div className={className}>
            <Excalidraw excalidrawAPI={api => setExcalidrawAPI(api)}
                        initialData={{elements: currentDocumentObj === undefined ? [] : currentDocumentObj.excalidrawElements}}
                        onChange={e=>{
                            commonStore.setIsDocumentsGroupDataUpdate(true)

                        }}
            />

            <button id={'excalidrawAPIButton'} className='hidden'
                    onClick={() => commonStore.patchDocumentsGroup(excalidrawAPI.getSceneElements(), 'excalidrawElements')}></button>
        </div>
    );
};

export default observer(ProcessComp);
