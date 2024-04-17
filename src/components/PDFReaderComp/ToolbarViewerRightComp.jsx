import ReactDOM from "react-dom";
import {HiOutlineAnnotation as AnnotationIcon} from "react-icons/hi";
import {TbPencilExclamation as PencilIcon} from "react-icons/tb";
import {CiRead as ReadIcon} from "react-icons/ci";
import {FaGripLines as LineIcon} from "react-icons/fa";
import {PiWavesBold as WaveIcon} from "react-icons/pi";
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
        annotationStraightLineCanvasConfigFunc
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
                                otherAnnotationIconContainer.classList.toggle("AnnotationIconActive", false)
                                otherAnnotationIconContainer.classList.toggle("AnnotationIconHover", false)
                            }
                        })


                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer.classList.toggle("AnnotationIconActive", true)
                        } else {
                            annotationIconContainer.classList.toggle("AnnotationIconActive", false)
                        }


                        onClickFunc()


                        console.log(_.cloneDeep(commonStore.annotationIconConfig.clicked))

                    }}
                    onMouseEnter={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer.classList.toggle("AnnotationIconHover", true)
                        }
                    }}
                    onMouseLeave={() => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        if (!commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer.classList.toggle("AnnotationIconHover", false)
                        }

                    }}>
            {children}
        </div>
    }


    return ReactDOM.createPortal(
        <div className={'AnnotationIconGroupContainer'}>
            <AnnotationIconContainer
                id={'ReadIconContainer'}
                title={'Only Read'}
                initFunc={() => {
                    commonStore.annotationIconConfig.iframeDocument.getElementById('ReadIconContainer').classList.toggle("AnnotationIconActive", true)
                    commonStore.updateAnnotationIconConfig({
                        clicked: {
                            id: 'ReadIconContainer',
                            value: true
                        }
                    })
                }}
                onClickFunc={() => {
                    commonStore.updateAnnotationZIndex()
                }}>
                <ReadIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>

            <AnnotationIconContainer id={'PencilIconContainer'} title={'Annotation Pencil'} onClickFunc={() => {
                Object.keys(commonStore.annotationIconConfig.canvasAnnotationElGroup).forEach(pageNum => {
                    const values = commonStore.annotationIconConfig.canvasAnnotationElGroup[pageNum]
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


            }}>
                <PencilIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>

            <AnnotationIconContainer id={'LineIconContainer'} title={'Annotation Straight Line'} onClickFunc={() => {
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


            }}>
                <LineIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>


            <AnnotationIconContainer id={'WaveIconContainer'} title={'Annotation Wave Line'}>
                <WaveIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>


        </div>


        ,
        container
    );
};

// export default observer(ToolbarViewerRightComp)
export default ToolbarViewerRightComp
