import React, {useState} from 'react';
import {observer} from "mobx-react-lite"
import {useStore} from "../../stores";

import MDEditor from '@uiw/react-md-editor';

const TestComp = () => {
    const {commonStore} = useStore()
    return <MDEditor value={commonStore.content} onChange={(e) => commonStore.updateContent(e)}/>
}

export default observer(TestComp);