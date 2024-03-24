import React from 'react';
import {observer} from "mobx-react-lite";

const SearchComp = () => {
    return (


        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="input input-bordered flex items-center gap-2 relative"
                   style={{maxHeight: '2rem', width: '25rem'}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                     className="w-4 h-4 opacity-70">
                    <path fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"/>
                </svg>
                <input type="text" className="grow" placeholder="Search..." style={{}}/>
            </label>

            <ul tabIndex={0}
                className="dropdown-content z-[10000] menu p-2 shadow bg-base-100 rounded-box w-[100%] m-1 ">
                <li><a className='flex justify-between items-center'>
                    <p>
                        Item 1
                    </p>

                    <div className="badge badge-neutral">neutral</div>
                </a></li>
                <li><a className='flex justify-between items-center'>
                    <p>
                        Item 2
                    </p>

                    <div className="badge badge-neutral">neutral</div>
                </a></li>
            </ul>
        </div>


    );
};

export default observer(SearchComp);