import React from 'react';
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SearchEngine from "./searchEngine";
import useAppHook from "../../useAppHook";
import _ from 'lodash'
import Swal from "sweetalert2";
import ModalContainerComp from "../ModalComp/ModalComp";

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
        const MAX_STR_NUM = 10
        if (str.length > MAX_STR_NUM) {
            return str.slice(0, MAX_STR_NUM) + '...'
        }
        return str


    }

    return (


        <label className="input input-bordered flex items-center gap-2 relative ml-10"
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
                    const searchObj = new SearchEngine(commonStore.documentsGroup, {
                        isCaseSensitive: commonStore.searchEngineConfig.isCaseSensitive,
                        findAllMatches: commonStore.searchEngineConfig.findAllMatches,
                        minMatchCharLength: commonStore.searchEngineConfig.minMatchCharLength,
                        location: commonStore.searchEngineConfig.location,
                        threshold: commonStore.searchEngineConfig.threshold,
                        distance: commonStore.searchEngineConfig.distance,
                        ignoreLocation: commonStore.searchEngineConfig.ignoreLocation,
                        includeMatches: true,
                        keys: ['markdownData.blocks.SearchedText']
                    })


                    searchObj.search(_.cloneDeep(searchPattern))
                    // console.log(searchObj.res, 'searchObj.res')
                    const res = searchObj.postSearchResult()


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


            <svg t="1711363933398" className="icon w-6 h-6 opacity-70" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" p-id="4342" width="200" height="200" onClick={e => {

                document.getElementById('modalSearchConfig').showModal()

            }}>
                <path
                    d="M990.12564 391.307264l-79.271936 46.15168c4.446208
                    24.23808 7.36256 48.9984 7.36256 74.5472 0 25.544704-2.916352 50.305024-7.360512 74.539008l79.271936 46.147584c32.380928 18.849792 43.476992 60.604416 24.7808 93.253632l-67.700736 118.243328c-18.694144 32.647168-60.102656 43.833344-92.485632 24.987648l-80.084992-46.626816c-37.419008 32.118784-79.95392 58.368-127.229952 75.24352l0 57.93792c0 37.70368-30.312448 68.268032-67.702784 68.268032l-135.405568 0c-37.390336 0-67.702784-30.5664-67.702784-68.268032l0-57.93792c-47.276032-16.877568-89.810944-43.126784-127.229952-75.24352l-80.084992 46.626816c-32.382976 18.847744-73.78944 7.661568-92.481536-24.987648L9.090632 725.94432c-18.694144-32.647168-7.600128-74.401792 24.7808-93.253632l79.271936-46.147584c-4.44416-24.231936-7.360512-48.994304-7.360512-74.539008 0-25.5488 2.916352-50.30912 7.360512-74.549248l-79.271936-46.147584c-32.380928-18.849792-43.474944-60.604416-24.7808-93.253632L76.797512 179.8144c18.692096-32.653312 60.09856-43.843584 92.481536-24.989696l80.08704 46.62272c37.419008-32.120832 79.95392-58.368 127.227904-75.24352L376.593992 68.27008C376.593992 30.5664 406.90644 0 444.296776 0l135.405568 0c37.390336 0 67.702784 30.5664 67.702784 68.27008l0 57.933824c47.273984 16.877568 89.808896 43.122688 127.227904 75.24352l80.08704-46.62272c32.382976-18.853888 73.791488-7.663616 92.485632 24.989696l67.700736 118.239232C1033.602632 330.7008 1022.506568 372.457472 990.12564 391.307264zM939.351624 302.628864l-33.851392-59.123712c-9.347072-16.32256-30.052352-21.919744-46.241792-12.496896l-94.0544 54.759424c-47.740928-54.300672-112.257024-93.253632-185.499648-108.249088L579.704392 102.395904c0-18.849792-15.1552-34.125824-33.851392-34.125824l-67.704832 0c-18.696192 0-33.851392 15.276032-33.851392 34.125824l0 75.122688c-73.242624 14.995456-137.75872 53.948416-185.499648 108.249088l-94.0544-54.759424c-16.18944-9.422848-36.892672-3.825664-46.241792 12.496896l-33.851392 59.123712c-9.347072 16.32256-3.79904 37.20192 12.3904 46.626816l94.431232 54.972416c-11.249664 33.957888-17.985536 69.996544-17.985536 107.778048 0 37.773312 6.733824 73.811968 17.983488 107.767808l-94.431232 54.976512c-16.18944 9.426944-21.737472 30.302208-12.3904 46.626816l33.851392 59.117568c9.34912 16.330752 30.052352 21.92384 46.241792 12.4928l94.050304-54.755328c47.742976 54.300672 112.259072 93.253632 185.503744 108.244992l0 75.128832c0 18.847744 15.1552 34.125824 33.851392 34.125824l67.704832 0c18.696192 0 33.851392-15.280128 33.851392-34.125824l0-75.128832c73.244672-14.993408 137.760768-53.946368 185.501696-108.244992l94.052352 54.755328c16.18944 9.428992 36.89472 3.837952 46.241792-12.4928l33.851392-59.117568c9.347072-16.324608 3.79904-37.199872-12.3904-46.626816l-94.431232-54.976512c11.249664-33.953792 17.983488-69.994496 17.983488-107.767808 0-37.779456-6.733824-73.816064-17.983488-107.773952l94.431232-54.974464C943.150664 339.830784 948.696648 318.951424 939.351624 302.628864zM512.001608 682.661888c-93.478912 0-169.25696-76.408832-169.25696-170.657792 0-94.2592 75.778048-170.674176 169.25696-170.674176 93.476864 0 169.25696 76.414976 169.25696 170.674176C681.25652 606.255104 605.478472 682.661888 512.001608 682.661888zM512.001608 409.602048c-56.088576 0-101.554176 45.84448-101.554176 102.402048 0 56.549376 45.467648 102.38976 101.554176 102.38976 56.08448 0 101.552128-45.838336 101.552128-102.38976C613.553736 455.446528 568.086088 409.602048 512.001608 409.602048z"
                    p-id="4343"></path>
            </svg>

            <ul className={`menu bg-base-200 rounded-box absolute w-[100%]   top-[120%] left-0  ${commonStore.searchEngineConfig.searchResultMenuOpen ? 'menu-dropdown-show' : 'hidden'}`}
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


            <ModalContainerComp>
                <dialog id="modalSearchConfig" className="modal">
                    <div className="modal-box min-w-[30vw]">
                        <h3 className="font-bold text-lg">Search Config</h3>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip tooltip-right"
                                      data-tip={'Indicates whether comparisons should be case sensitive.'}>Is Case Sensitive</span>
                                <input type="checkbox"  className="checkbox"
                                       checked={commonStore.searchEngineConfig.isCaseSensitive}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           isCaseSensitive: e.target.checked
                                       })}
                                />
                            </label>
                        </div>


                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip tooltip-right"
                                      data-tip={'When true, the matching function will continue to the end of a search pattern even if a perfect match has already been located in the string.'}>Find All Matches</span>
                                <input type="checkbox"  className="checkbox "
                                       checked={commonStore.searchEngineConfig.findAllMatches}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           findAllMatches: e.target.checked
                                       })}
                                />
                            </label>
                        </div>


                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip tooltip-right"
                                      data-tip={'Only the matches whose length exceeds this value will be returned. (For instance, if you want to ignore single character matches in the result, set it to 2)'}>Min Match Char Length</span>
                                <input type="number" placeholder="Type here"
                                       className="input input-bordered w-full max-w-xs "

                                       value={commonStore.searchEngineConfig.minMatchCharLength}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           minMatchCharLength: e.target.value
                                       })}

                                       />
                            </label>
                        </div>


                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip tooltip-right"
                                      data-tip={'Determines approximately where in the text is the pattern expected to be found.'}>Location</span>
                                <input type="number" placeholder="Type here"
                                       className="input input-bordered w-full max-w-xs "

                                       value={commonStore.searchEngineConfig.location}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           location: e.target.value
                                       })}
                                />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip tooltip-right"
                                      data-tip={'At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.'}>Threshold</span>
                                <input type="number" placeholder="Type here"
                                       className="input input-bordered w-full max-w-xs "

                                       value={commonStore.searchEngineConfig.threshold}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           threshold: e.target.value
                                       })}
                                />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip  tooltip-right"
                                      data-tip={'Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified. A distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8.'}>Distance</span>
                                <input type="number" placeholder="Type here"
                                       className="input input-bordered w-full max-w-xs "

                                       value={commonStore.searchEngineConfig.distance}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           distance: e.target.value
                                       })}
                                />
                            </label>
                        </div>


                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text tooltip tooltip-right"
                                      data-tip={'When true, search will ignore location and distance, so it won\'t matter where in the string the pattern appears.'}>Ignore Location</span>
                                <input type="checkbox" className="checkbox "

                                       checked={commonStore.searchEngineConfig.ignoreLocation}
                                       onChange={e => commonStore.patchSearchEngineConfig({
                                           ignoreLocation: e.target.checked
                                       })}
                                />
                            </label>
                        </div>

                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </ModalContainerComp>

        </label>


    );
};

export default observer(SearchComp);
