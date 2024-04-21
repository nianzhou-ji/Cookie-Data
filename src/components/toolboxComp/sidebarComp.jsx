import React, {useState} from 'react';
import useSidebarHook from "./useSidebarHook";
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";


const SidebarComp = () => {
    const {SidebarConfig} = useSidebarHook()
    const {toolBoxStore} = useStore()

    return (
        <div className='w-80 overflow-auto flex-none'>
            <ul className="menu ">
                {SidebarConfig.map((item1,index1 ) => {
                    if (item1.type === 'firstGrade') {
                        return <>
                            <li key={item1.id} className='menu-dropdown-toggle'>
                                <details id={item1.id} open={item1.defaultOpen}>
                                    <summary className="group font-bold"><span>{item1.icon}</span> {item1.title}
                                    </summary>
                                    <ul>
                                        {item1.children.map(item2 => <li key={item2.id}><a href="#"
                                                                                           id={item2.id}
                                                                                           className={`group ${toolBoxStore.sidebarItemCurrentID === item2.id ? 'active' : null}`}
                                                                                           onClick={() => {
                                                                                               // console.log(item2.id)
                                                                                               toolBoxStore.setSidebarItemCurrentID(item2.id, item2.title)
                                                                                               item2.clickCallBack()
                                                                                           }}
                                        >
                                            <span>{item2.title}</span> </a></li>)}

                                    </ul>
                                </details>
                            </li>
                            <li key={item1.id+index1}></li>
                        </>

                    } else {
                        return <>

                            <li key={item1.id}>
                                <details id={item1.id} open={item1.defaultOpen}>
                                    <summary className="group font-bold">
                                        <span>{item1.icon}</span>
                                        {item1.title}
                                    </summary>
                                    <ul>
                                        {
                                            item1.children.map(item2 => {
                                                return <li key={item2.id}>
                                                    <h2 className="menu-title flex items-center  gap-4 px-1.5"><span
                                                        className="text-base-content">{item2.icon}</span> {item2.title}
                                                    </h2>
                                                    <ul>
                                                        {
                                                            item2.children.map(item3 => <li key={item3.id}>
                                                                <a
                                                                    href="#"
                                                                    id={item3.id}
                                                                    className={`group ${toolBoxStore.sidebarItemCurrentID  === item3.id ? 'active' : null}`}
                                                                    onClick={() => {
                                                                        // console.log(item3.id)
                                                                        toolBoxStore.setSidebarItemCurrentID(item3.id, item3.title)
                                                                        item3.clickCallBack()
                                                                    }}
                                                                >
                                                                    <span>{item3.title}</span>
                                                                </a>
                                                            </li>)
                                                        }

                                                    </ul>
                                                </li>

                                            })
                                        }
                                    </ul>
                                </details>
                            </li>
                            <li key={item1.id+'ssss'}></li>
                        </>
                    }
                })}
            </ul>

        </div>
    );
};

export default observer(SidebarComp);