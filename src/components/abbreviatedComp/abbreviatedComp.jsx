import React from 'react';
import {observer} from "mobx-react-lite";

import {useStore} from "../../stores";
import {useResizeObserver} from "../useResizeObserver";


const AbbreviatedComp = ({
                             text, className, lineNum, averageWordSize,
                             onDoubleClick = () => {
                             },
                             onKeyDown = (event) => {
                             },

                             onClick = () => {
                             },

                         }) => {
    const {commonStore} = useStore()
    const [elRef, elSize] = useResizeObserver()
    return (
        <div ref={elRef}

             onDoubleClick={onDoubleClick}
             onKeyDown={onKeyDown}
             onClick={onClick}

             data-tip={commonStore.getAbbreviateStr(text, elSize?.width / averageWordSize * lineNum).tooltip}
             className={`break-words text-left ${commonStore.getAbbreviateStr(text, elSize?.width / averageWordSize * lineNum).class} ` + className}>
            {commonStore.getAbbreviateStr(text, elSize?.width / averageWordSize * lineNum).text}
        </div>
    );
};

export default observer(AbbreviatedComp);
