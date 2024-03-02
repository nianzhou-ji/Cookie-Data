import React from 'react';
import {useStore} from "../../stores";
import MDEditor from "@uiw/react-md-editor";
import {observer} from "mobx-react-lite";

const MarkdownComp = ({className}) => {
    const {commonStore} = useStore()
    const currentDocumentObj = commonStore.getCurrentDocumentObj()
    return <MDEditor value={currentDocumentObj === undefined ? "" : currentDocumentObj.content}
                     onChange={(e) => commonStore.patchDocumentsGroup(e)} className={className} />


};


export default observer(MarkdownComp);