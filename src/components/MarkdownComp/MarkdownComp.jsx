import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";


const MarkdownComp = ({className}) => {
    return <div id={'editorjs'} className={`${className}`} style={{
        maxHeight: '92vh',
        height: '92vh',
        overflow: "auto",
        // backgroundColor:'blue'
    }}></div>
};


export default observer(MarkdownComp);