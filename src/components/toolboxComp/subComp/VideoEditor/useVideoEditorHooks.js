const useVideoEditorHooks=()=>{
    const sliderValueToVideoTime=(duration, sliderValue)=> {
        return Math.round(duration * sliderValue / 100)
    }


    return{sliderValueToVideoTime}
}

export default useVideoEditorHooks