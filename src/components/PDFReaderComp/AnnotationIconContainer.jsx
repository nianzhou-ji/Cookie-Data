import React, {useEffect} from "react";
import {useStore} from "../../stores";
import {observer} from "mobx-react-lite";

const AnnotationIconContainer = (
    {
        children, id, title,
        initFunc = () => {
        },
        onClickFunc = () => {
        },
        joinButtonGroup = true,
        isChecked = true
    }) => {

    const {commonStore} = useStore()

    useEffect(() => {

        commonStore.updateAnnotationIconConfig({
            clicked: {
                id: id,
                value: false
            }
        })


        initFunc()
    }, []);


    return <div id={id} title={title}
                style={{
                    marginRight: '0.5rem',
                    width: '1.5rem',
                    height: '1.5rem',
                    position: "relative"

                }}
                className={`JpTw-flex JpTw-items-center JpTw-justify-center JpTw-bg-enter`}
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
                            otherAnnotationIconContainer?.classList?.toggle("JpTw-bg-active", false)
                        }
                    })


                    if (isChecked){
                        if (commonStore.annotationIconConfig.clicked[id]) {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-active", true)
                        } else {
                            annotationIconContainer?.classList?.toggle("JpTw-bg-active", false)
                        }
                    }else {
                        annotationIconContainer?.classList?.toggle("JpTw-bg-active", false)
                    }




                    onClickFunc()


                }}
                onMouseEnter={() => {
                    const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                    if (commonStore.annotationIconConfig.clicked[id]) {
                        annotationIconContainer?.classList?.toggle("JpTw-bg-enter", false)
                    }
                }}
                onMouseLeave={() => {
                    const annotationIconContainer = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
                    if (commonStore.annotationIconConfig.clicked[id]) {
                        annotationIconContainer?.classList?.toggle("JpTw-bg-enter", true)
                    }

                }}
    >
        {children}
    </div>
}


export default observer(AnnotationIconContainer)
