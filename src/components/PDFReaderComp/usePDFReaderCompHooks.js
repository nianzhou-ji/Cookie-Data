import {fabric} from "fabric";
import {useStore} from "../../stores";
import _ from "lodash";

const usePDFReaderCompHooks = () => {

    const {commonStore} = useStore()


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
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.color = commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value;
        canvas.freeDrawingBrush.width = commonStore.annotationIconConfig.iframeDocument.querySelector('#JpLineWidth').value;


        setElAttr(['JpColorPicker', 'JpLineWidth'], [
            (el) => {
                el.addEventListener('change', (e) => {
                    canvas.freeDrawingBrush.color = e.target.value
                })
            },

            (el) => {
                el.addEventListener('change', (e) => {
                    canvas.freeDrawingBrush.width = e.target.value
                })
            },
        ])


    }


    const annotationStraightLineCanvasConfigFunc = (canvas) => {

        let line, isDown;
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
            const points = [pointer.x, pointer.y, pointer.x, pointer.y];
            line = new fabric.Line(points, {
                strokeWidth: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpLineWidth').value,
                fill: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value,
                stroke: commonStore.annotationIconConfig.iframeDocument.querySelector('#JpColorPicker').value,
                originX: 'center',
                originY: 'center'
            });
            isDown = true;
            canvas.add(line);


            setElAttr(['JpColorPicker', 'JpLineWidth'], [
                (el) => {
                    el.addEventListener('change', (e) => {
                        line.fill = e.target.value
                        line.stroke = e.target.value
                    })
                },

                (el) => {
                    el.addEventListener('change', (e) => {
                        line.strokeWidth = e.target.value
                    })
                },
            ])


        });

        // 监听鼠标移动事件
        canvas.on('mouse:move', function (o) {
            if (commonStore.annotationIconConfig.canvasObjSelectionState) return
            if (!isDown) return;
            const pointer = canvas.getPointer(o.e);
            line.set({x2: pointer.x, y2: pointer.y});
            canvas.renderAll();
        });

        // 监听鼠标松开事件
        canvas.on('mouse:up', function (o) {
            isDown = false;
        });


    }
    const annotationArrowCanvasConfigFunc = (canvas) => {

        let fromx, fromy, tox, toy, isDown, pline;
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
        canvas.on('mouse:down', function (event) {

            if (commonStore.annotationIconConfig.canvasObjSelectionState) return
            const pointer = canvas.getPointer(event.e);
            fromx = pointer.x;
            fromy = pointer.y;
            isDown = true


        });

        // 监听鼠标移动事件
        canvas.on('mouse:move', function (event) {
            if (commonStore.annotationIconConfig.canvasObjSelectionState) return
            if (!isDown) return;

            canvas.loadFromJSON(commonStore.annotationIconConfig.history['arrowCache'], function () {
                canvas.renderAll();
            });

            const pointer = canvas.getPointer(event.e);
            tox = pointer.x;
            toy = pointer.y;
            //this.drawArrow(startX, startY, endX, endY);

            var angle = Math.atan2(toy - fromy, tox - fromx);

            var headlen = 10;  // arrow head size

            // bring the line end back some to account for arrow head.
            tox = tox - (headlen) * Math.cos(angle);
            toy = toy - (headlen) * Math.sin(angle);

            // calculate the points.
            const points = [
                {
                    x: fromx,  // start point
                    y: fromy
                }, {
                    x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
                    y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
                }, {
                    x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
                    y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
                }, {
                    x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
                    y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
                }, {
                    x: tox + (headlen) * Math.cos(angle),  // tip
                    y: toy + (headlen) * Math.sin(angle)
                }, {
                    x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
                    y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
                }, {
                    x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
                    y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
                }, {
                    x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
                    y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
                }, {
                    x: fromx,
                    y: fromy
                }
            ];


            canvas.remove(pline)


            pline = new fabric.Polyline(points, {
                fill: 'red', //'white',
                stroke: 'red', //'black',
                opacity: 1,
                strokeWidth: 1,
                originX: 'left',
                originY: 'top',
                selectable: true
            });


            canvas.add(pline)


            canvas.renderAll();








        });


        // 监听鼠标松开事件
        canvas.on('mouse:up', function (event) {
            isDown = false

            commonStore.updateAnnotationIconConfig({
                history: {
                    key: 'arrowCache',
                    value: canvas.toJSON()
                }
            })

        });


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


            setElAttr(['JpColorPicker', 'JpLineWidth'], [
                (el) => {
                    el.addEventListener('change', (e) => {
                        textbox.fill = e.target.value
                        textbox.stroke = e.target.value
                    })
                },

                (el) => {
                    el.addEventListener('change', (e) => {
                        // canvas.freeDrawingBrush.width = e.target.value
                    })
                },
            ])

            canvas.add(textbox);

        });


    }


    // const annotationWaveLineCanvasConfigFunc = (canvas) => {
    //
    //     const path = new fabric.Path('M 10.4425 64.309L 11.8685 63.571L 13.2905 62.969L 14.7155 62.508L 16.1375 62.192L 17.5635 62.02L 18.9895 61.985L 20.4155 62.098L 21.8365 62.3521L 23.2625 62.746L 24.6845 63.285L 26.1105 63.961L 27.5365 64.778L 28.9585 65.7271L 30.3835 66.813L 31.8095 68.028L 33.2355 69.371L 34.6575 70.84L 36.0835 72.43L 37.5045 74.137L 38.9305 75.953L 40.3565 77.879L 41.7785 79.911L 43.2045 82.035L 44.6295 84.254L 46.0515 86.563L 47.4775 88.95L 48.9035 91.411L 50.3255 93.946L 51.7515 96.535L 53.1765 99.188L 54.5985 101.887L 56.0245 104.625L 57.4505 107.403L 58.8725 110.207L 60.2975 113.035L 61.7235 115.875L 63.1455 118.723L 64.5715 121.571L 65.9975 124.411L 67.4195 127.239L 68.8445 130.039L 70.2665 132.817L 71.6925 135.555L 73.1185 138.254L 74.5445 140.903L 75.9655 143.493L 77.3915 146.024L 78.8135 148.481L 80.2395 150.868L 81.6655 153.168L 83.0865 155.387L 84.5125 157.508L 85.9385 159.535L 87.3645 161.457L 88.7865 163.274L 90.2125 164.973L 91.6335 166.559L 93.0595 168.024L 94.4855 169.364L 95.9075 170.575L 97.3335 171.653L 98.7585 172.602L 100.181 173.411L 101.607 174.082L 103.033 174.618L 104.455 175.008L 105.88 175.254L 107.306 175.364L 108.728 175.325L 110.154 175.145L 111.58 174.821L 113.002 174.356L 114.427 173.754L 115.853 173.008L 117.275 172.125L 118.701 171.11L 120.127 169.961L 121.548 168.684L 122.974 167.282L 124.396 165.754L 125.822 164.106L 127.248 162.344L 128.67 160.477L 130.095 158.5L 131.521 156.422L 132.947 154.25L 134.369 151.989L 135.795 149.641L 137.216 147.219L 138.642 144.719L 140.068 142.161L 141.49 139.535L 142.916 136.864L 144.341 134.145L 145.763 131.383L 147.189 128.594L 148.615 125.778L 150.037 122.942L 151.463 120.098L 152.888 117.246L 154.31 114.403L 155.736 111.571L 157.162 108.754L 158.584 105.961L 160.009 103.203L 161.435 100.481L 162.857 97.809L 164.283 95.188L 165.709 92.625L 167.13 90.129L 168.556 87.703L 169.978 85.36L 171.404 83.094L 172.83 80.922L 174.255 78.844L 175.677 76.871L 177.103 75L 178.529 73.239L 179.951 71.594L 181.377 70.067L 182.798 68.661L 184.224 67.383L 185.65 66.235L 187.072 65.219L 188.498 64.336L 189.923 63.594L 191.345 62.989L 192.771 62.524L 194.197 62.203L 195.619 62.02L 197.045 61.985L 198.47 62.09L 199.892 62.34L 201.318 62.731L 202.744 63.262L 204.166 63.934L 205.591 64.746L 207.017 65.692L 208.439 66.774L 209.865 67.985L 211.291 69.325L 212.713 70.785L 214.138 72.371L 215.564 74.075L 216.986 75.887L 218.412 77.813L 219.837 79.836L 221.259 81.961L 222.685 84.176L 224.111 86.481L 225.533 88.864L 226.959 91.325L 228.38 93.8521L 229.806 96.446L 231.232 99.094L 232.658 101.789L 234.08 104.528L 235.505 107.305L 236.927 110.11L 238.353 112.934L 239.779 115.774L 241.201 118.621L 242.627 121.469L 244.052 124.313L 245.474 127.137L 246.9 129.942L 248.326 132.719L 249.748 135.461L 251.173 138.161L 252.599 140.809L 254.021 143.403L 255.447 145.934L 256.873 148.395L 258.295 150.785L 259.72 153.09L 261.146 155.309L 262.568 157.438L 263.994 159.465L 265.42 161.391L 266.841 163.211L 268.267 164.914L 269.689 166.504L 271.115 167.973L 272.541 169.317L 273.966 170.532L 275.388 171.618L 276.814 172.571L 278.24 173.383L 279.662 174.063L 281.087 174.598L 282.509 174.996L 283.935 175.25L 285.361 175.36L 286.787 175.328L 288.209 175.153L 289.634 174.836L 291.056 174.375L 292.482 173.778L 293.908 173.035');
    //     path.stroke = 'red';
    //     path.fill = '';
    //     canvas.add(path);
    //
    // }


    const createFabricCanvas = (values, canvasConfigFunc = canvas => {
    }) => {

        const canvas = new fabric.Canvas(values.canvasAnnotationEl, {
            containerClass: 'JpCanvasAnnotationWrapper',
            width: values.pageDivElSize.width,
            height: values.pageDivElSize.height
        });
        const wrapperEl = values.pageDivEl.querySelector('.JpCanvasAnnotationWrapper')
        wrapperEl.style.zIndex = '1'
        wrapperEl.style.top = `0`
        wrapperEl.style.left = `0`
        wrapperEl.style.position = 'absolute'
        canvasConfigFunc(canvas)

        const eventNames = [
            'object:modified',
            'object:moving',
            'object:scaling',
            'object:rotating',
            'object:added',
            'object:removed',
        ]


        eventNames.forEach(name => {
            canvas.on(name, function (e) {
                // console.log(name);
                commonStore.updateAnnotationIconConfig({
                    history: {
                        key: values.pageNum,
                        value: canvas.toJSON()
                    }
                })
            });
        })

        canvas.loadFromJSON(commonStore.annotationIconConfig.history[values.pageNum], function () {
            canvas.renderAll();
        });


        canvas.renderAll();
        commonStore.updateAnnotationZIndex()


        commonStore.updateAnnotationIconConfig({
            fabricCanvas: {
                key: `${values.pageNum}`,
                value: canvas
            }
        })

        // commonStore.updateTestVars({
        //
        //     key: `${values.pageNum}`,
        //     value: canvas
        //
        // })


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
        annotationStraightLineCanvasConfigFunc,
        // annotationWaveLineCanvasConfigFunc,
        annotationTextCanvasConfigFunc,
        annotationArrowCanvasConfigFunc,
        setElAttr
    }

}


export default usePDFReaderCompHooks
