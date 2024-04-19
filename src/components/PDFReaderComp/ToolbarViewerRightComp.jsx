import ReactDOM from "react-dom";
import {HiOutlineAnnotation as AnnotationIcon} from "react-icons/hi";
import {TbPencilExclamation as PencilIcon} from "react-icons/tb";
import {CiRead as ReadIcon} from "react-icons/ci";
import {FaGripLines as LineIcon} from "react-icons/fa";
import {PiWavesBold as WaveIcon} from "react-icons/pi";
import {FaLongArrowAltRight as ArrowIcon} from "react-icons/fa";
import {BiText as TextIcon} from "react-icons/bi";
import { LuMousePointerClick as SelectionObjectIcon} from "react-icons/lu";
import {SiTestin as TestIcon} from "react-icons/si";
import {IoIosColorPalette as ColorPaletteIcon} from "react-icons/io";

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
        annotationStraightLineCanvasConfigFunc,
        // annotationWaveLineCanvasConfigFunc,
        annotationTextCanvasConfigFunc,
        annotationArrowCanvasConfigFunc,
        setElAttr,
        discardActiveObject,
        loadHistory,
        annotationSelectionObjectCanvasConfigFunc,
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
                <input type="color" id={'JpColorPicker'} style={{marginRight: '1rem'}}/>
                <div style={{display: "flex", alignItems: "center", marginRight: '1rem'}} id={'JpLineWidthContainer'}>
                    <p style={{fontWeight: "bold", marginRight: '0.25rem'}}>Line Width: </p>
                    <input type="number" id={'JpLineWidth'} style={{width: '2.5rem'}} defaultValue={3} min={2}/>
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
                <ReadIcon size={'1.25rem'}
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

            <AnnotationIconContainer id={'LineIconContainer'} title={'Annotation Straight Line'} onClickFunc={() => {
                discardActiveObject()
                saveHistory()
                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[pageNum]
                    createFabricCanvas(values, annotationStraightLineCanvasConfigFunc)
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
                        el.style.display = 'flex'
                    },
                    (el) => {
                        el.style.display = 'block'
                    },
                ])
                loadHistory()


            }}>
                <LineIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>





            <AnnotationIconContainer id={'ArrowIconContainer'} title={'Arrow Annotation'} onClickFunc={() => {
                discardActiveObject()
                saveHistory()
                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[pageNum]
                    createFabricCanvas(values, annotationArrowCanvasConfigFunc)
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
                        el.style.display = 'flex'
                    },
                    (el) => {
                        el.style.display = 'block'
                    }
                ])

                loadHistory()



            }}>
                <ArrowIcon size={'1.25rem'}
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
        </div>


        ,
        container
    );
};

// export default observer(ToolbarViewerRightComp)
export default ToolbarViewerRightComp
