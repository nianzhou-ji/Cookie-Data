import React, {useEffect, useState} from 'react';
import 'pdfjs-viewer-element'
import ReactDOM from "react-dom";
import {fabric} from "fabric";
import Utils from "../../utils";
import {observer} from "mobx-react-lite";
import {fetchFile, toBlobURL} from '@ffmpeg/util'
import {useStore} from "../../stores";
import _ from "lodash";
import usePDFReaderCompHooks from "./usePDFReaderCompHooks";
import {createRoot} from "react-dom/client";
import {v4 as uuidv4} from 'uuid';
import CustomAnnotationTools from "./CustomAnnotationTools";

const baseURL = 'http://localhost:8082/assets';


// const pdfUrl = await toBlobURL(baseURL + '/pdfjs/test1.pdf', 'text/pdf')
const JpPDFCss = await toBlobURL(baseURL + '/pdfjs/jp-pdfjs-css.css', 'text/css')

const PdfReaderComp = ({url}) => {

    const {commonStore} = useStore()
    const [canvasData, setCanvasData] = useState('{"version":"5.3.0","objects":[{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":306.5,"top":226.5,"width":252.01,"height":86,"fill":null,"stroke":"purple","strokeWidth":5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",308.995,228.995],["Q",309,229,310,230],["Q",311,231,314.5,232.5],["Q",318,234,322,237],["Q",326,240,330.5,243],["Q",335,246,340,249.5],["Q",345,253,348.5,256],["Q",352,259,356,261.5],["Q",360,264,364,267],["Q",368,270,371,271.5],["Q",374,273,377,274.5],["Q",380,276,381.5,276],["Q",383,276,384,276.5],["Q",385,277,386.5,277.5],["Q",388,278,389.5,278],["Q",391,278,392.5,278],["Q",394,278,395.5,278],["Q",397,278,398,278],["Q",399,278,400,277.5],["Q",401,277,402.5,277],["Q",404,277,405,276.5],["Q",406,276,407.5,276],["Q",409,276,411.5,275],["Q",414,274,416,273],["Q",418,272,419.5,272],["Q",421,272,422.5,272],["Q",424,272,426,272],["Q",428,272,429,272],["Q",430,272,430.5,272],["Q",431,272,431.5,272],["Q",432,272,433,272],["Q",434,272,435,272],["Q",436,272,436.5,273],["Q",437,274,438,274],["Q",439,274,440.5,274],["Q",442,274,444,274],["Q",446,274,449,274],["Q",452,274,454.5,273.5],["Q",457,273,460,272.5],["Q",463,272,465.5,270.5],["Q",468,269,469,268],["Q",470,267,470.5,266.5],["Q",471,266,472,265.5],["Q",473,265,473.5,264],["Q",474,263,474.5,262.5],["Q",475,262,476,261],["Q",477,260,478,259.5],["Q",479,259,480,258],["Q",481,257,481.5,256.5],["Q",482,256,483,255],["Q",484,254,485.5,253],["Q",487,252,487.5,251.5],["Q",488,251,488.5,250],["Q",489,249,489.5,249],["Q",490,249,490.5,248],["Q",491,247,492,248.5],["Q",493,250,495.5,253],["Q",498,256,500.5,260],["Q",503,264,506.5,269],["Q",510,274,513,278],["Q",516,282,519.5,287],["Q",523,292,526,296],["Q",529,300,531.5,303],["Q",534,306,535.5,308],["Q",537,310,538,311.5],["Q",539,313,539.5,313.5],["Q",540,314,540,314.5],["Q",540,315,540.5,315],["Q",541,315,541.5,315],["Q",542,315,542.5,315],["Q",543,315,543.5,315],["Q",544,315,544.5,315],["Q",545,315,546,315],["Q",547,315,549,315],["Q",551,315,552.5,315],["Q",554,315,555.5,315],["Q",557,315,559,315],["L",561.005,315]]},{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":151.5,"top":396.5,"width":525.01,"height":8,"fill":null,"stroke":"purple","strokeWidth":5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",153.995,404],["Q",154,404,154,404.5],["Q",154,405,155,405],["Q",156,405,156.5,405],["Q",157,405,160,405],["Q",163,405,170.5,404.5],["Q",178,404,188,404],["Q",198,404,213,404],["Q",228,404,250,404.5],["Q",272,405,297.5,405],["Q",323,405,352.5,405],["Q",382,405,409.5,406],["Q",437,407,466.5,407],["Q",496,407,523.5,407],["Q",551,407,573,405.5],["Q",595,404,611,404],["Q",627,404,640,403.5],["Q",653,403,659.5,402.5],["Q",666,402,669.5,401.5],["Q",673,401,676,400],["L",679.005,398.995]]},{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":331.5,"top":473.5,"width":470.01,"height":14,"fill":null,"stroke":"purple","strokeWidth":5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",333.995,475.995],["Q",334,476,335.5,476.5],["Q",337,477,343.5,477.5],["Q",350,478,359,479.5],["Q",368,481,382,483],["Q",396,485,415,485],["Q",434,485,454.5,485.5],["Q",475,486,501,488],["Q",527,490,555.5,490],["Q",584,490,607,490],["Q",630,490,653.5,489.5],["Q",677,489,696,489],["Q",715,489,730.5,487.5],["Q",746,486,758.5,484.5],["Q",771,483,778.5,482.5],["Q",786,482,791.5,481],["Q",797,480,800.5,478.5],["L",804.005,476.995]]},{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":687.5,"top":267.5,"width":29.8,"height":279.83,"fill":null,"stroke":"purple","strokeWidth":5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",691,269.995],["Q",691,270,690.5,270],["Q",690,270,690,270.5],["Q",690,271,690,273],["Q",690,275,690.5,278.5],["Q",691,282,692,286.5],["Q",693,291,694,298],["Q",695,305,697,312.5],["Q",699,320,701,332],["Q",703,344,704.5,357],["Q",706,370,709.5,387],["Q",713,404,715,422],["Q",717,440,718.5,454.5],["Q",720,469,719.5,481.5],["Q",719,494,719,500.5],["Q",719,507,719,513],["Q",719,519,719,524],["Q",719,529,719,533],["Q",719,537,718,540.5],["Q",717,544,717,545.5],["Q",717,547,716.5,548],["Q",716,549,716,549.5],["Q",716,550,715.5,549],["L",714.995,547.995]]},{"type":"path","version":"5.3.0","originX":"left","originY":"top","left":533.5,"top":381.5,"width":36,"height":170.01,"fill":null,"stroke":"purple","strokeWidth":5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"round","strokeUniform":false,"strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",536,383.995],["Q",536,384,536.5,384.5],["Q",537,385,537,388.5],["Q",537,392,538.5,398],["Q",540,404,542,410.5],["Q",544,417,546,427.5],["Q",548,438,550,452.5],["Q",552,467,554.5,483],["Q",557,499,560,509.5],["Q",563,520,565,528],["Q",567,536,568,541.5],["Q",569,547,570.5,550.5],["L",572.005,554.005]]}]}')

    const {
        createFabricCanvas,
        annotationPencilCanvasConfigFunc,
        annotationTextCanvasConfigFunc,
        saveHistory,
        loadHistory,
        refreshPDFMessage,
        renderCanvas,
        initPDFReaderComp
    } = usePDFReaderCompHooks()


    useEffect(() => {
        // const uuid = uuidv4();
        // console.log('UUID:', uuid);

        // const test=async ()=>{
        //     console.log(await Utils.urlToBase64(baseURL + '/pdfjs/test2.pdf'));
        // }
        //
        // test()

    }, [])


    useEffect(() => {


        initPDFReaderComp()


    }, []);


    return <pdfjs-viewer-element
        style={{
            width: '100%',
            height: '100%',
        }}
        viewer-path={'/pdfjs-4.0.189-dist'} // 开发时使用
        // viewer-path={baseURL+'/pdfjs/pdfjs-4.0.189-dist'} // build 时使用
        viewer-extra-styles-urls={`['${JpPDFCss}']`}


        src={url}
    />;


};

export default observer(PdfReaderComp);
