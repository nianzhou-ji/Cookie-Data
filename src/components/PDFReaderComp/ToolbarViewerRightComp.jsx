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
const baseURL = 'http://localhost:8082/assets';
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




    return ReactDOM.createPortal(
        <div></div>


        ,
        container
    );
};

// export default observer(ToolbarViewerRightComp)
export default ToolbarViewerRightComp
