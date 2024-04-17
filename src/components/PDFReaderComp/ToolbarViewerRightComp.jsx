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

const ToolbarViewerRightComp = ({container}) => {

    const {commonStore} = useStore()
    container.innerHTML = '';
    container.style.cssText = "display: flex; align-items: center;";

    const AnnotationIconContainer = ({children, id, title}) => {

        useEffect(() => {
            commonStore.updateAnnotationIconConfig({
                clicked: {
                    id: id,
                    value: false
                }
            })
        }, []);

        return <div id={id} title={title} className={`AnnotationIcon`}
                    onClick={e => {
                        const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                        // commonStore.updateAnnotationIconConfig({
                        //     clicked: {
                        //         id: id,
                        //         value: !commonStore.annotationIconConfig.clicked[id]
                        //     }
                        // })


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

            <AnnotationIconContainer id={'ReadIconContainer'} title={'Only Read'}>
                <ReadIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>

            <AnnotationIconContainer id={'PencilIconContainer'} title={'Annotation Pencil'}>
                <PencilIcon size={'1.25rem'}
                />
            </AnnotationIconContainer>

            <AnnotationIconContainer id={'LineIconContainer'} title={'Annotation Straight Line'}>
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
