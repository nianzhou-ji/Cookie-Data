

const TestComp = () => {


    return (
        <div className='flex flex-col w-screen h-screen p-3'>
            <div className='bg-red-600 flex-none'>
                Header
            </div>

            <div className='flex-grow  flex '>
                <div className='flex-none bg-blue-600'>sidebar</div>
                <div className='flex-grow flex flex-col'>
                    <div className='bg-yellow-50 flex-none'>
                        <p>adsfa</p>
                        <button>fawefgawef</button>
                    </div>

                    <div className='bg-black rounded-2xl flex-grow flex justify-start items-center text-white flex-col
                    overflow-scroll basis-0
                    '>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                        <div className='text-5xl'>log</div>
                    </div>
                </div>

            </div>


        </div>
    )

}

export default TestComp;