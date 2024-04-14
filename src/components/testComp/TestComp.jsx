import React, {useEffect, useState, useRef, useCallback} from 'react';
import 'pdfjs-viewer-element'
import {toBlobURL} from "@ffmpeg/util";
const baseURL = 'http://localhost:8082/assets/pdfjs';

export default function TestComp({url=baseURL+'/test.pdf'}){


    const [pdfURL, setPdfURL] = useState('')



    useEffect(() => {


        const initData = async ()=>{
           const pdfurl = await toBlobURL(url,  'application/pdf')

            setPdfURL(pdfurl)
        }

        initData()



    }, []);




    return <pdfjs-viewer-element  style={{
        height:'100vh',
        width:'100vw',
    }} src={pdfURL} viewer-path={'/pdfjs-4.0.189-dist'} ></pdfjs-viewer-element>;
}

