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

const ToolbarViewerRightComp = ({container}) => {

    const {commonStore} = useStore()
    container.innerHTML = '';
    container.style.cssText = "display: flex; align-items: center;";


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
            }
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


        return <div id={id} title={title} className={`AnnotationIcon`}
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
                            } else {
                                commonStore.updateAnnotationIconConfig({
                                    clicked: {
                                        id: item,
                                        value: false
                                    }
                                })

                                const otherAnnotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(item)
                                otherAnnotationIconContainer?.classList?.toggle("AnnotationIconActive", false)
                                otherAnnotationIconContainer?.classList?.toggle("AnnotationIconHover", false)
                            }
                        })


                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("AnnotationIconActive", true)
                        } else {
                            annotationIconContainer?.classList?.toggle("AnnotationIconActive", false)
                        }


                        onClickFunc()


                        // console.log(_.cloneDeep(commonStore.annotationIconConfig.clicked))

                    }}
                    onMouseEnter={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("AnnotationIconHover", true)
                        }
                    }}
                    onMouseLeave={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("AnnotationIconHover", false)
                        }

                    }}>
            {children}
        </div>
    }


    return ReactDOM.createPortal(
        <div className={'AnnotationIconGroupContainer'}>


            <div id={'JpAnnotationConfig'} style={{display: "flex"}}>
                <input type="color" id={'JpColorPicker'} className='mr-[1rem]'/>
                <div className='flex items-center mr-[1rem]' id={'JpLineWidthContainer'}>
                    <p className='font-bold mr-[0.25rem]'>Line Width: </p>
                    <input type="number" id={'JpLineWidth'} className='w-[2.5rem]' defaultValue={3} min={2}/>
                </div>

            </div>


            <VerticalIcon size={'1.25rem'} style={{marginRight: '1rem'}} id={'JpAnnotationConfigDivider'}/>


            <AnnotationIconContainer
                id={'ReadIconContainer'}
                title={'Only Read'}
                initFunc={() => {
                    commonStore.annotationIconConfig.iframeDocument.getElementById('ReadIconContainer')?.classList?.toggle("AnnotationIconActive", true)
                    commonStore.updateAnnotationIconConfig({
                        clicked: {
                            id: 'ReadIconContainer',
                            value: true
                        }
                    })

                    setElAttr(['JpColorPicker', 'JpLineWidthContainer', 'JpAnnotationConfigDivider'], [
                        (el) => {
                            el.style.display = 'none'
                        },
                        (el) => {
                            el.style.display = 'none'
                        },
                        (el) => {
                            el.style.display = 'none'
                        },
                    ])
                }}
                onClickFunc={() => {
                    discardActiveObject()
                    saveHistory()
                    commonStore.updateAnnotationZIndex()


                    setElAttr(['JpColorPicker', 'JpLineWidthContainer', 'JpAnnotationConfigDivider'], [
                        (el) => {
                            el.style.display = 'none'
                        },
                        (el) => {
                            el.style.display = 'none'
                        },
                        (el) => {
                            el.style.display = 'none'
                        },
                    ])


                    loadHistory()


                }}>
                <ReadIcon size={'1.25rem'} className='bg-red-500'
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


                setElAttr(['JpColorPicker', 'JpLineWidthContainer', 'JpAnnotationConfigDivider'], [
                    (el) => {
                        el.style.display = 'block'
                    },
                    (el) => {
                        el.style.display = 'flex'
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


                setElAttr(['JpColorPicker', 'JpLineWidthContainer', 'JpAnnotationConfigDivider'], [
                    (el) => {
                        el.style.display = 'block'
                    },
                    (el) => {
                        el.style.display = 'none'
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


            <div className="">

                <ListIcon className='hover:bg-red-500' size={'1.25rem'} onClick={() => {
                   const JpPdfList = commonStore.annotationIconConfig.iframeDocument.getElementById('JpPdfList')
                    JpPdfList.classList.toggle('hidden')
                }}/>


                <div id={'JpPdfList'}
                     className="hidden absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                     role="menu"
                >
                    <div className="p-2">


                        <a
                            href="#"
                            className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            role="menuitem"
                        >
                            pdf1
                        </a>


                        <a
                            href="#"
                            className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            role="menuitem"
                        >
                            pdf2
                        </a>
                    </div>

                    <div className="p-2">
                        <form method="POST" action="#">
                            <button
                                type="submit"
                                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                role="menuitem"
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
                        </form>
                    </div>
                </div>
            </div>
        </div>


        ,
        container
    );
};

// export default observer(ToolbarViewerRightComp)
export default ToolbarViewerRightComp
