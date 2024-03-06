import { Excalidraw } from "@excalidraw/excalidraw";


const TestComp = () => {

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Excalidraw Example</h1>
            <div style={{ height: "500px" }}>
                <Excalidraw  onChange={e=>{
                    console.log(e)}}/>
            </div>
        </>
    )
}

export default TestComp;