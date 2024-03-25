import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SearchEngine from "./searchEngine";
import useAppHook from "../../useAppHook";
import _ from 'lodash'
import Swal from "sweetalert2";

const SearchComp = () => {
    const {initInterfaceData} = useAppHook()
    const {commonStore} = useStore()


    const clearHighlight = () => {
        const elements = document.querySelectorAll('.JpSearchHighlight');
        elements.forEach(function (element) {
            element.classList.remove('JpSearchHighlight');
        });
    }


    const matchStr = (item) => {

        const MAX_BADGE_NUM = 2


        const value = item.match.value
        const indices = item.match.indices


        let res = []
        indices.forEach(foo => {
            res.push(value.slice(foo[0], foo[1] + 1))
        })

        if (res.length > MAX_BADGE_NUM) {
            const resNew = res.slice(0, MAX_BADGE_NUM)
            resNew.push('...')
            return {
                data: resNew,
                tooltip: res.slice(MAX_BADGE_NUM).join(', ')
            }

        }

        return {
            data: res,
            tooltip: null
        }

    }

    const subStrShow = (str) => {
        const MAX_STR_NUM = 20
        if (str.length > MAX_STR_NUM) {
            return str.slice(0, MAX_STR_NUM) + '...'
        }
        return str


    }

    return (


        <label className="input input-bordered flex items-center gap-2 relative"
               style={{maxHeight: '2rem', width: '25rem'}} onBlur={() => {

        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                 className="w-6 h-6 opacity-70">
                <path fillRule="evenodd"
                      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                      clipRule="evenodd"/>
            </svg>
            <input type="text" className="grow" placeholder="Search..." style={{}} onKeyDown={async e => {
                if (e.key === 'Enter') {
                    if (commonStore.searchEngineConfig.searchedText.length === 0) {
                        // await Swal.fire({
                        //     icon: "error",
                        //     title: "Oops...",
                        //     text: "Search text is empty, please input"
                        // });

                        alert("Search text is empty, please input")
                        return
                    }


                    clearHighlight()


                    const searchPattern = commonStore.searchEngineConfig.searchedText
                    const searchObj = new SearchEngine(commonStore.documentsGroup)
                    searchObj.search(_.cloneDeep(searchPattern))
                    const res = searchObj.postSearchResult()

                    // console.log(res, 'postSearchResult')
                    if (res === null) {
                        // await Swal.fire({
                        //     icon: "info",
                        //     title: "Not search  result",
                        // });

                        alert("Not search  result")

                        return

                    }

                    commonStore.patchSearchEngineConfig({
                        searchResultMenuOpen: true,
                        searchResultList: res
                    })

                }
            }} value={commonStore.searchEngineConfig.searchedText} onChange={e => {
                commonStore.patchSearchEngineConfig({
                    searchedText: e.target.value
                })

                if (commonStore.searchEngineConfig.searchedText.length === 0) {
                    commonStore.patchSearchEngineConfig({
                        searchResultMenuOpen: false
                    })
                }


                clearHighlight()

            }}/>

            <ul className={`menu bg-base-200 rounded-box absolute w-[150%]   top-[120%] left-0  ${commonStore.searchEngineConfig.searchResultMenuOpen ? 'menu-dropdown-show' : 'hidden'}`}
                style={{zIndex: 100000}}>
                {commonStore.searchEngineConfig.searchResultList.map((item, index) => <li key={index}
                                                                                          style={{pointerEvents: "initial"}}
                                                                                          onClick={async (e) => {
                                                                                              commonStore.updateCurrentDocumentID(item.id)
                                                                                              await initInterfaceData(() => {

                                                                                                  clearHighlight()


                                                                                                  const element = document.querySelector(`[data-id="${item.match.block.id}"]`);
                                                                                                  if (element) {
                                                                                                      element.classList.add("JpSearchHighlight");

                                                                                                  }

                                                                                                  commonStore.patchSearchEngineConfig({
                                                                                                      searchResultMenuOpen: false
                                                                                                  })

                                                                                                  element.scrollIntoView({
                                                                                                      behavior: "smooth" // 指定平滑滚动
                                                                                                  });

                                                                                              })


                                                                                          }}><a
                    className='flex justify-between items-center'>
                    <p>
                        {item.name}
                    </p>


                    {matchStr(item).tooltip === null ? matchStr(item).data.map((bar, index) => <div className='flex'>
                        <div className="badge badge-neutral tooltip"
                             data-tip={bar}>{subStrShow(bar)}</div>
                    </div>) : null}

                    {matchStr(item).tooltip !== null ? matchStr(item).data.map((bar, index) => <div className='flex'>
                        <div className="badge badge-neutral tooltip"
                             data-tip={bar === '...' ? matchStr(item).tooltip : bar}
                        >{subStrShow(bar)}</div>
                    </div>) : null}


                </a>
                </li>)}

            </ul>

        </label>


    );
};

export default observer(SearchComp);