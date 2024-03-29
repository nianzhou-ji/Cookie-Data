import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";

const ToolboxComp = () => {
    const {commonStore} = useStore()

    return (
        <div className={`${commonStore.appCompOpenConfig.toolboxAppOpen ? null : 'hidden'} w-full bg-red-500`}>
            toolboxAppOpen
        </div>
    );
};

export default observer(ToolboxComp);