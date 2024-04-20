import ReactDOM from "react-dom";
import {HiOutlineAnnotation as AnnotationIcon} from "react-icons/hi";
import {TbPencilExclamation as PencilIcon} from "react-icons/tb";
import {CiRead as ReadIcon} from "react-icons/ci";
import {FaGripLines as LineIcon} from "react-icons/fa";
import {PiWavesBold as WaveIcon} from "react-icons/pi";
import {FaLongArrowAltRight as ArrowIcon} from "react-icons/fa";
import {BiText as TextIcon} from "react-icons/bi";
import {LuMousePointerClick as SelectionObjectIcon} from "react-icons/lu";
import {SiTestin as TestIcon} from "react-icons/si";
import {IoIosColorPalette as ColorPaletteIcon} from "react-icons/io";
import {ImList as ListIcon} from "react-icons/im";

import {RxDividerVertical as VerticalIcon} from "react-icons/rx";
import React, {useEffect} from "react";
import {useStore} from "../../stores";
import {observer} from "mobx-react-lite";
import _ from 'lodash'
import {fabric} from "fabric";
import usePDFReaderCompHooks from "./usePDFReaderCompHooks";
import { createRoot } from 'react-dom/client';
import Utils from "../../utils";

const ToolbarViewerRightComp = ({container}) => {

    const {commonStore} = useStore()

    const {
        createFabricCanvas,
        annotationPencilCanvasConfigFunc,

        annotationTextCanvasConfigFunc,
        setElAttr,
        discardActiveObject,
        loadHistory,

        saveHistory
    } = usePDFReaderCompHooks()

    const AnnotationIconContainer = (
        {
            children, id, title,
            initFunc = () => {
            },
            onClickFunc = () => {
            },
            joinButtonGroup = true
        }) => {

        useEffect(() => {

            commonStore.updateAnnotationIconConfig({
                clicked: {
                    id: id,
                    value: false
                }
            })


            initFunc()
        }, []);


        return <div id={id} title={title} className={`mr-[0.5rem] w-[1.5rem] h-[1.5rem] flex items-center justify-center relative`}
                    onClick={e => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        Object.keys(commonStore.annotationIconConfig.clicked).forEach(item => {
                            if (item === id) {
                                commonStore.updateAnnotationIconConfig({
                                    clicked: {
                                        id: id,
                                        value: !commonStore.annotationIconConfig.clicked[id]
                                    }
                                })
                            } else if (item !== id && joinButtonGroup) {
                                commonStore.updateAnnotationIconConfig({
                                    clicked: {
                                        id: item,
                                        value: false
                                    }
                                })

                                const otherAnnotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(item)
                                otherAnnotationIconContainer?.classList?.toggle("bg-[#AEAEAF]", false)
                                otherAnnotationIconContainer?.classList?.toggle("bg-[#DDDEDF]", false)
                            }
                        })


                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("bg-[#AEAEAF]", true)
                        } else {
                            annotationIconContainer?.classList?.toggle("bg-[#AEAEAF]", false)
                        }


                        onClickFunc()


                    }}
                    onMouseEnter={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("bg-[#DDDEDF]", true)
                        }
                    }}
                    onMouseLeave={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("bg-[#DDDEDF]", false)
                        }

                    }}>
            {children}
        </div>
    }


    return ReactDOM.createPortal(
        <div className='flex items-center '>


            <div id={'JpAnnotationConfig'} style={{display: "flex"}}>
                <input type="color" id={'JpColorPicker'} className='mr-[1rem]' value={'#FF0000'}/>

            </div>


            <VerticalIcon size={'1.25rem'} style={{marginRight: '1rem'}} id={'JpAnnotationConfigDivider'}/>


            <AnnotationIconContainer
                id={'ReadIconContainer'}
                title={'Only Read'}
                initFunc={() => {
                    commonStore.annotationIconConfig.iframeDocument.getElementById('ReadIconContainer')?.classList?.toggle("bg-[#AEAEAF]", true)
                    commonStore.updateAnnotationIconConfig({
                        clicked: {
                            id: 'ReadIconContainer',
                            value: true
                        }
                    })

                    setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                        (el) => {
                            el.style.display = 'none'
                        },

                        (el) => {
                            el.style.display = 'none'
                        },
                    ])
                }}
                onClickFunc={() => {
                    commonStore.updateTestVars()


                    discardActiveObject()
                    saveHistory()
                    commonStore.updateAnnotationZIndex()


                    setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                        (el) => {
                            el.style.display = 'none'
                        },
                        (el) => {
                            el.style.display = 'none'
                        },
                    ])


                    loadHistory()


                }}>
                <ReadIcon size={'1.25rem'} className=''
                />
            </AnnotationIconContainer>


            <AnnotationIconContainer id={'PencilIconContainer'} title={'Annotation Pencil'} onClickFunc={() => {
                discardActiveObject()
                saveHistory()
                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[pageNum]
                    // console.log(_.cloneDeep(values), 'values')
                    createFabricCanvas(values, annotationPencilCanvasConfigFunc)
                    commonStore.updateAnnotationIconConfig({
                        canvasAnnotationElGroup: {
                            key: `${pageNum}`,
                            value: {
                                ...values,
                                fabricRendered: true,
                            }
                        }
                    })


                })


                setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                    (el) => {
                        el.style.display = 'block'
                    },
                    (el) => {
                        el.style.display = 'block'
                    },
                ])

                loadHistory()


            }}>
                <PencilIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>


            <AnnotationIconContainer id={'TextIconContainer'} title={'Annotation Text'} onClickFunc={() => {

                discardActiveObject()
                saveHistory()
                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[pageNum]
                    createFabricCanvas(values, annotationTextCanvasConfigFunc)
                    commonStore.updateAnnotationIconConfig({
                        canvasAnnotationElGroup: {
                            key: `${pageNum}`,
                            value: {
                                ...values,
                                fabricRendered: true
                            }
                        }
                    })


                })


                setElAttr(['JpColorPicker', 'JpAnnotationConfigDivider'], [
                    (el) => {
                        el.style.display = 'block'
                    },

                    (el) => {
                        el.style.display = 'block'
                    }
                ])

                loadHistory()


            }}>
                <TextIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>


            <AnnotationIconContainer
                id={'ListIconContainer'}
                title={'PDF List'}
                onClickFunc={() => {
                    commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList').classList.toggle('hidden')
                    const newElement = document.createElement('div');
                    const root = createRoot(newElement);
                    root.render(<a
                        href="#"
                        className=" block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        role="menuitem"
                        onClick={()=>{
                            console.log('menuitem')
                        }}

                        id={'666ID'}
                    >
                        {66666}
                    </a>);

                    // 使用appendChild将这个新的div添加到容器中
                    commonStore.annotationIconConfig.iframeDocument.querySelector('#JpPdfList .p-2').appendChild(newElement);

                }}

                joinButtonGroup={false}

            >
                <ListIcon size={'1.25rem'}/>
                <div id={'JpPdfList'}
                     className="hidden absolute top-[100%] end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                     role="menu"
                     key={commonStore.testVars.length}
                >
                    <div className="p-2">

                        {

                            commonStore.testVars.map((item, index) =>
                                <div>
                                    <a
                                        href="#"
                                        className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                        role="menuitem"
                                        key={index}
                                        id={index+1+'id'}
                                    >
                                        {item}
                                    </a>
                                </div>

                                )
                        }


                    </div>

                    <div className="p-2">

                            <button
                                type="submit"
                                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                role="menuitem"
                                onClick={()=>{
                                    Utils.removeElementById('2id', commonStore.annotationIconConfig.iframeDocument)
                                    // console.log(commonStore.annotationIconConfig.iframeDocument.getElementById('1id'));
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>

                                Delete Product
                            </button>

                    </div>
                </div>
            </AnnotationIconContainer>



        </div>


        ,
        container
    );
};

// export default observer(ToolbarViewerRightComp)
export default ToolbarViewerRightComp
