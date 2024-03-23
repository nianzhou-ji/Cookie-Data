import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";


const MarkdownComp = ({className}) => {
    const {commonStore} = useStore()
    return <div id={'editorjs'}
                className={`flex-auto ${className} ${commonStore.documentsGroup.length > 0 && commonStore.appCompOpenConfig.markdownAppOpen ? null : 'hidden'}`}
                style={{
                    maxHeight: '92vh',
                    height: '92vh',
                    overflow: "auto",
                }}></div>
};


export default observer(MarkdownComp);