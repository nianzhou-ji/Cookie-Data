import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";


const MarkdownComp = ({className}) => {
    const {commonStore} = useStore()
    return <div id={'editorjs'}
                className={`${className} ${commonStore.appCompOpenConfig.markdownAppOpen ? null : 'hidden'}`} style={{
        maxHeight: '92vh',
        height: '92vh',
        overflow: "auto",

        // backgroundColor:'blue'
    }}></div>
};


export default observer(MarkdownComp);