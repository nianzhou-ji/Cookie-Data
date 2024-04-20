import {fabric} from "fabric";
import {useStore} from "../../stores";
import _ from "lodash";

const usePDFReaderCompHooks = () => {

    const {commonStore} = useStore()

    const discardActiveObject = () => {
        Object.keys(commonStore.annotationIconConfig.fabricCanvas).forEach(key => {
            const canvas = commonStore.annotationIconConfig.fabricCanvas[key]

            canvas.discardActiveObject()
            canvas.renderAll()
        })
    }


    const setElAttr = (idGroup, funcGroup) => {

        idGroup.forEach((id, index) => {
            const el = commonStore.annotationIconConfig.iframeDocument.getElementById(id)
            if (el !== null) {
                funcGroup[index](el)
            }

        })
    }

    const annotationPencilCanvasConfigFunc = (canvas) => {
        // 初始化自由绘图模式参数
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value;
        canvas.freeDrawingBrush.width = 3;


        setElAttr(['JpColorPicker'], [
            (el) => {
                el.addEventListener('change', (e) => {
                    canvas.freeDrawingBrush.color = e.target.value
                })
            }
        ])


    }



    const loadHistory = () => {

        Object.keys(commonStore.annotationIconConfig.fabricCanvas).forEach(key => {
            const canvas = commonStore.annotationIconConfig.fabricCanvas[key]
            canvas.loadFromJSON(commonStore.annotationIconConfig.history[key], function () {
                canvas.renderAll();
            });
        })


    }


    const saveHistory = () => {

        Object.keys(commonStore.annotationIconConfig.fabricCanvas).forEach(key => {
            const canvas = commonStore.annotationIconConfig.fabricCanvas[key]
            commonStore.updateAnnotationIconConfig({
                history: {
                    key: key,
                    value: canvas.toJSON()
                }
            })
        })


    }

    const annotationTextCanvasConfigFunc = (canvas) => {
        canvas.on('selection:created', () => {
            // console.log('selection:created')
            commonStore.updateAnnotationIconConfig({
                canvasObjSelectionState: true
            })
        })

        canvas.on('selection:updated', () => {
            // console.log('selection:updated ')
            commonStore.updateAnnotationIconConfig({
                canvasObjSelectionState: true
            })
        })


        canvas.on('selection:cleared', () => {
            // console.log('selection:cleared  ')
            commonStore.updateAnnotationIconConfig({
                canvasObjSelectionState: false
            })
        })

        // 监听鼠标按下事件
        canvas.on('mouse:down', function (o) {
            if (commonStore.annotationIconConfig.canvasObjSelectionState) return
            const pointer = canvas.getPointer(o.e);
            const textbox = new fabric.Textbox('Text', {
                left: pointer.x,
                top: pointer.y,
                fill: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value,
                strokeWidth: 1,
                stroke: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value,
            });


            setElAttr(['JpColorPicker'], [
                (el) => {
                    el.addEventListener('change', (e) => {
                        textbox.fill = e.target.value
                        textbox.stroke = e.target.value
                    })
                },


            ])

            canvas.add(textbox);
            canvas.setActiveObject(textbox);
            canvas.renderAll();


        });


    }


    const createFabricCanvas = (values, canvasConfigFunc = canvas => {
    }) => {

        const canvas = new fabric.Canvas(values.canvasAnnotationEl, {
            containerClass: 'JpCanvasAnnotationWrapper',
            width: values.pageDivElSize.width,
            height: values.pageDivElSize.height
        });

        canvas.backgroundColor = 'rgba(255, 223, 186, 0.5)';  // 你可以选择任何颜色和透明度

        const wrapperEl = values.pageDivEl.querySelector('.JpCanvasAnnotationWrapper')
        if(wrapperEl===null)return
        wrapperEl.style.zIndex = '1'
        wrapperEl.style.top = `0`
        wrapperEl.style.left = `0`
        wrapperEl.style.position = 'absolute'
        canvasConfigFunc(canvas)
        loadHistory()




        commonStore.updateAnnotationZIndex()
        commonStore.updateAnnotationIconConfig({
            fabricCanvas: {
                key: `${values.pageNum}`,
                value: canvas
            }
        })


        // 添加键盘事件监听
        commonStore.annotationIconConfig.iframeDocument.addEventListener('keydown', function (event) {
            // 检查是否按下了 'delete' 键
            if (event.key === 'Delete') {
                const activeObject = canvas.getActiveObject();
                if (activeObject) {
                    // 删除当前选中的对象
                    canvas.remove(activeObject);
                    canvas.requestRenderAll();  // 确保画布更新显示
                }
            }
        });


        return canvas
    }


    return {
        createFabricCanvas,
        annotationPencilCanvasConfigFunc,
        annotationTextCanvasConfigFunc,
        setElAttr,
        discardActiveObject,
        loadHistory,
        saveHistory
    }

}


export default usePDFReaderCompHooks
