import {fabric} from "fabric";
import {useStore} from "../../stores";

const usePDFReaderCompHooks = () => {


    const {commonStore} = useStore()

    const annotationPencilCanvasConfigFunc = (canvas) => {
        // 初始化自由绘图模式参数
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = 'red';
        canvas.freeDrawingBrush.width = 5;
    }


    const annotationStraightLineCanvasConfigFunc = (canvas) => {

        let line, isDown;

        canvas.off('mouse:down')
        canvas.off('mouse:move')
        canvas.off('mouse:up')

        // 监听鼠标按下事件
        canvas.on('mouse:down', function (o) {
            const pointer = canvas.getPointer(o.e);
            const points = [pointer.x, pointer.y, pointer.x, pointer.y];
            line = new fabric.Line(points, {
                strokeWidth: 2,
                fill: 'red',
                stroke: 'red',
                originX: 'center',
                originY: 'center'
            });
            isDown = true;
            canvas.add(line);
        });

        // 监听鼠标移动事件
        canvas.on('mouse:move', function (o) {
            // console.log(canvas.getPointer(o.e))
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


    const annotationWaveLineCanvasConfigFunc = (canvas) => {

    }


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


        // 监听对象修改事件
        canvas.on('object:modified', function(e) {
            console.log('Object modified:', e.target);
        });

        // 监听对象移动事件
        canvas.on('object:moving', function(e) {
            console.log('Object moving:', e.target);

        });

        // 监听对象缩放事件
        canvas.on('object:scaling', function(e) {
            console.log('Object scaling:', e.target);
        });

        // 监听对象旋转事件
        canvas.on('object:rotating', function(e) {
            console.log('Object rotating:', e.target);
        });

        // 监听对象添加事件
        canvas.on('object:added', function(e) {
            console.log('Object added:', e.target);

            console.log(JSON.stringify(canvas.toJSON(), null, 2), 'toJson');

        });

        // 监听对象移除事件
        canvas.on('object:removed', function(e) {
            console.log('Object removed:', e.target);
        });








        canvas.renderAll();
        commonStore.updateAnnotationZIndex()

        return canvas
    }


    return {
        createFabricCanvas,
        annotationPencilCanvasConfigFunc,
        annotationStraightLineCanvasConfigFunc,
        annotationWaveLineCanvasConfigFunc
    }

}


export default usePDFReaderCompHooks
