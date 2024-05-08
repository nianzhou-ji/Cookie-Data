import logo from './logo.svg';
import './App.css';
import {FiSave as SaveIcon} from "react-icons/fi";
import {SiCodereview as SearchIcon} from "react-icons/si";
import {IoList as DocumentsIcon} from "react-icons/io5";
import {FaFileExport as ExportIcon} from "react-icons/fa";
import {SiCookiecutter as TitleIcon} from "react-icons/si";
import {IoMdAddCircle as AddIcon} from "react-icons/io";
import {AiFillDelete as DeleteIcon} from "react-icons/ai";
import {IoCloseCircle as CloseIcon} from "react-icons/io5";
import {MdDraw as DrawICon} from "react-icons/md";
import {AiOutlineFileMarkdown as MarkDownIcon} from "react-icons/ai";
import {observer} from "mobx-react-lite";
import MarkdownComp from "./components/MarkdownComp/MarkdownComp";
import {LuDatabaseBackup as BackupIcon} from "react-icons/lu";
import {TbDatabaseImport as ImportBackupDataIcon} from "react-icons/tb";
import {FaFilePdf as PDFReaderIcon} from "react-icons/fa6";
import {useStore} from "./stores";
import indexedDBEngine from "./indexDBUtils/indexDBUtils";
import ModalContainerComp from "./components/ModalComp/ModalComp";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import _ from "lodash";
import ProcessComp from "./components/processComp/processComp";
import useMarkdownHooks from "./components/MarkdownComp/useMarkdownHooks";
import useAppHook from "./useAppHook";
import ErrorPage from "./components/ErrorPageComp/ErrorPageComp";
import Utils from "./utils";
import SearchComp from "./components/searchComp/searchComp";
import ToolboxComp from "./components/toolboxComp/toolboxComp";
import PdfReaderComp from "./components/PDFReaderComp/PDFReaderComp";
import {createRoot} from "react-dom/client";
import {useCommonHooks} from "./components/useCommonHooks";
import AbbreviatedComp from "./components/abbreviatedComp/abbreviatedComp";

function App() {
    const {commonStore, toolBoxStore} = useStore()


    const [appOpenCache, setAppOpenCache] = useState({})


    const {updateMarkdownData} = useMarkdownHooks()


    const {initInterfaceData, initAppIconState, buttonGroupID} = useAppHook()


    useEffect(() => {
        commonStore.initDocumentsGroup().then(async () => {
            await initInterfaceData()
        })


    }, []);


    useEffect(() => {

        commonStore.initPDFReaderData()


        const PDFReaderContainer = createRoot(document.getElementById('PDFReaderContainer'))
        PDFReaderContainer.render(<PdfReaderComp/>)


    }, [commonStore.currentDocumentID]);


    useEffect(() => {
        initAppIconState()


    }, [commonStore.documentsGroup])


    const [documentNameDoubleClick, setDocumentNameDoubleClick] = useState(false)


    // document.addEventListener('keydown', async function (event) {
    //     if (event.ctrlKey && event.key === 's') {
    //         event.preventDefault(); // 阻止默认行为，即阻止浏览器执行保存操作
    //         // 在这里编写你的回调函数逻辑
    //         const res = commonStore.saveIndexedDB()
    //         if (res) {
    //             commonStore.setIsDocumentsGroupDataUpdate(false)
    //         } else {
    //             commonStore.setIsDocumentsGroupDataUpdate(true)
    //         }
    //     }
    // });


    document.addEventListener('paste', function (event) {
        // 获取粘贴板中的数据
        const items = (event.clipboardData || window.clipboardData).items;

        // 遍历粘贴板中的每个项目
        for (let i = 0; i < items.length; i++) {
            // 如果项目类型为图像
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();

                // 使用FileReader读取文件内容
                const reader = new FileReader();
                reader.onload = function (event) {
                    // 此处的event.target.result就是图像的Base64编码
                    const base64String = event.target.result;
                    navigator.clipboard.writeText(`<img src="${base64String}" />`).then(function () {
                        console.log('Copying to clipboard was successful!');
                    }, function (err) {
                        console.error('Could not copy text: ', err);
                    });
                };

                // 读取文件为Data URL
                reader.readAsDataURL(file);
            }
        }
    });


    const btnClass = ' btn btn-ghost btn-square btn-sm hover:scale-125 hover:shadow-xl focus:outline-none focus:ring active:bg-gray-500'


    const tooltipWrapperClass = 'tooltip tooltip-left tooltip tooltip-left mr-2 flex items-center'


    const {saveData} = useCommonHooks()


    return (
        <div id={'app'} className="flex flex-col h-screen w-screen max-h-screen">
            <div style={{}} className=" w-screen h-[3rem] flex  flex-none items-center justify-between px-2">

                <div className='flex'>
                    <div className="flex items-center">
                        <TitleIcon size={'2rem'} className=''/>
                        <div className='font-bold '>Cookie Data</div>
                        <p className='ml-3'>{commonStore.VERSION}</p>
                    </div>

                    {toolBoxStore.toolboxAppOpenIconState ? <SearchComp/> : null}
                </div>


                <div className='flex'>
                    <AbbreviatedComp
                        averageWordSize={10}
                        lineNum={1}
                        className={`mr-3 max-w-[200px] w-[200px]  font-bold  flex items-center ${toolBoxStore.toolboxAppOpenIconState && !documentNameDoubleClick ? null : 'hidden'} tooltip-bottom`}
                        text={commonStore.getCurrentDocumentObj()?.name}
                        onDoubleClick={() => {
                            setDocumentNameDoubleClick(true)
                        }}


                    />


                    <input type="text" placeholder="Type here"
                           className={`mr-3 mt-2 input input-sm input-bordered w-[200px] ${toolBoxStore.toolboxAppOpenIconState && documentNameDoubleClick ? null : 'hidden'}`}
                           defaultValue={commonStore.getCurrentDocumentObj()?.name}
                           onKeyDown={async (event) => {
                               if (event.key === "Enter") {
                                   // 当 Enter 键被按下时执行的逻辑
                                   setDocumentNameDoubleClick(false); // 清空输入框

                                   if(event.target.value.length!==0){

                                       commonStore.updateCurrentDocumentName(event.target.value)

                                       await saveData('Update document name success')
                                   }




                               }


                               if (event.key === "Escape") {
                                   // 当 Escape 键被按下时执行的逻辑
                                   setDocumentNameDoubleClick(false); // 清空输入框


                               }
                           }}

                      />


                    <div className={tooltipWrapperClass} data-tip="add document">
                        <ModalContainerComp>
                            <dialog id="addDocument_modal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Title</h3>
                                    <input type="text" placeholder="Type here"
                                           className="mt-2 input input-bordered" style={{width: '100%'}}
                                           value={commonStore.addDocumentName}
                                           onChange={e => commonStore.updateAddDocumentName(e.target.value)}/>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            {/* if there is a button in form, it will close the modal */}
                                            <button className="btn" onClick={async () => {
                                                const id = crypto.randomUUID()
                                                const name = commonStore.addDocumentName
                                                const markdownData = _.cloneDeep(commonStore.initMarkdownData)
                                                const processData = _.cloneDeep(commonStore.initProcessData)
                                                commonStore.addDocumentsGroup({
                                                    id, name, markdownData, processData
                                                })
                                                commonStore.updateCurrentDocumentID(id)

                                                updateMarkdownData(markdownData)

                                                commonStore.processDrawObj.store.loadSnapshot(processData)

                                                commonStore.updateAppCompOpenConfig({
                                                    markdownAppOpen: true,
                                                    processAppOpen: false,
                                                    errorPageAppOpen: false,
                                                    toolboxAppOpen: false,
                                                    PDFReaderAppOpen: false
                                                })


                                                await saveData('Create document success')


                                            }}>Confirm
                                            </button>

                                            <button className="btn ml-2">Close
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </ModalContainerComp>

                        <AddIcon size={'1.5rem'} className={btnClass + 'cursor-pointer'}
                                 onClick={() => {
                                     commonStore.updateAddDocumentName(Utils.formatTime(new Date()))
                                     document.getElementById('addDocument_modal').showModal()
                                 }} id={'AddIconID'}/>
                    </div>
                    <div className={tooltipWrapperClass} data-tip="delete document">
                        <DeleteIcon id={'DeleteIconID'} size={'1.5rem'}
                                    className={btnClass + 'cursor-pointer'} onClick={async () => {

                            const result = await Swal.fire({
                                html: `${commonStore.getCurrentDocumentObj().name}`,
                                title: 'Delete document',
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: 'Confirm',
                                cancelButtonText: 'Cancel',
                            })
                            if (result.isConfirmed) {

                                commonStore.deleteDocumentsGroup(commonStore.currentDocumentID)
                                const res = await commonStore.saveIndexedDB()

                                if (res.state) {
                                    await Swal.fire({
                                        position: "top-end",
                                        icon: "success",
                                        title: "Delete success",
                                        showConfirmButton: false,
                                        timer: 1500
                                    });


                                    if (commonStore.documentsGroup.length === 0) {
                                        commonStore.updateAppCompOpenConfig({
                                            markdownAppOpen: false,
                                            processAppOpen: false,
                                            errorPageAppOpen: true,
                                            toolboxAppOpen: false,
                                            PDFReaderAppOpen: false
                                        })
                                        return
                                    }

                                    commonStore.updateCurrentDocumentID(commonStore.documentsGroup[commonStore.documentsGroup.length - 1].id)
                                    await initInterfaceData()


                                } else {
                                    await Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Delete failed"
                                    });
                                }

                            }


                        }}/>
                    </div>

                    <div className={tooltipWrapperClass} data-tip="markdown">
                        <MarkDownIcon id={'MarkDownIconID'} size={'1.5rem'}
                                      className={btnClass + 'cursor-pointer'} onClick={async () => {
                            commonStore.updateAppCompOpenConfig({
                                markdownAppOpen: true,
                                processAppOpen: false,
                                errorPageAppOpen: false,
                                toolboxAppOpen: false,
                                PDFReaderAppOpen: false
                            })
                            await initInterfaceData()

                            toolBoxStore.updateToolboxAppOpenIconState(true)
                        }}/>
                    </div>

                    <div className={tooltipWrapperClass} data-tip="PDF Reader">
                        <PDFReaderIcon id={'PDFReaderIconID'} size={'1.5rem'}
                                       className={btnClass + 'cursor-pointer'} onClick={async () => {
                            commonStore.updateAppCompOpenConfig({
                                markdownAppOpen: false,
                                processAppOpen: false,
                                errorPageAppOpen: false,
                                toolboxAppOpen: false,
                                PDFReaderAppOpen: true,

                            })

                            toolBoxStore.updateToolboxAppOpenIconState(true)
                        }}/>
                    </div>


                    <div className={tooltipWrapperClass} data-tip="process">
                        <DrawICon id={'DrawIConID'} size={'1.5rem'}
                                  className={btnClass + 'cursor-pointer'} onClick={async () => {
                            commonStore.updateAppCompOpenConfig({
                                markdownAppOpen: false,
                                processAppOpen: true,
                                errorPageAppOpen: false,
                                toolboxAppOpen: false,
                                PDFReaderAppOpen: false
                            })

                            toolBoxStore.updateToolboxAppOpenIconState(true)
                            await initInterfaceData()
                        }}/>
                    </div>

                    <div className={tooltipWrapperClass} data-tip="view document list">
                        <DocumentsIcon id={'DocumentsIconID'} size={'1.5rem'}
                                       className={btnClass + 'cursor-pointer'} htmlFor="my-drawer-4"
                                       onClick={() => {
                                           document.getElementById('drawerID').click()
                                       }}/>

                        <ModalContainerComp>
                            <div className="drawer z-50">
                                <input id="my-drawer-4" type="checkbox" className="drawer-toggle"/>
                                <div className="drawer-content">
                                    {/* Page content here */}
                                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary hidden"
                                           id={'drawerID'}>Open drawer</label>
                                </div>
                                <div className="drawer-side">
                                    <label htmlFor="my-drawer-4" aria-label="close sidebar"
                                           className="drawer-overlay" onClick={(e) => {
                                    }}></label>
                                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                                        {/* Sidebar content here */}
                                        {commonStore.documentsGroup.slice().reverse().map(item => <li key={item.id}
                                                                                                      className={`mb-3 ${item.id === commonStore.currentDocumentID ? 'bg-blue-100' : null}`}>
                                            <a
                                                onClick={async () => {
                                                    commonStore.updateCurrentDocumentID(item.id)

                                                    await initInterfaceData()

                                                }}>{item.name}</a>
                                        </li>)}

                                    </ul>
                                </div>
                            </div>
                        </ModalContainerComp>

                    </div>
                    <div className={tooltipWrapperClass} data-tip='save document'>
                        <SaveIcon id={'SaveIconID'} size={'1.5rem'}
                                  className={btnClass + 'cursor-pointer'}
                                  color={`${commonStore.isDocumentsGroupDataUpdate ? '#fa0404' : '#000'}`}
                                  onClick={async () => {

                                      // Swal.fire({
                                      //     title: 'Collecting data  ...',
                                      //     didOpen: () => {
                                      //         Swal.showLoading();
                                      //     },
                                      //
                                      //     allowOutsideClick: false
                                      // })


                                      await saveData('Data save success')

                                  }}/>
                    </div>

                    <div className={tooltipWrapperClass} data-tip='backup all documents to local desktop'>
                        <BackupIcon id={'BackupIconID'} size={'1.5rem'}
                                    className={btnClass + 'cursor-pointer'} onClick={() => {
                            commonStore.downloadAllData()
                        }}/>
                    </div>
                    <div className={tooltipWrapperClass} data-tip='import backup documents'>
                        <ModalContainerComp>
                            <dialog id="ImportBackupData_modal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Import backup data</h3>
                                    <input id="importBackupFileInputEl" type="file"
                                           className="file-input file-input-bordered w-full mt-3" multiple
                                           accept=".json"

                                    />
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn mr-3" onClick={async () => {

                                                if (document.getElementById('importBackupFileInputEl').files.length === 0) return
                                                const res = await commonStore.parsingBackupData(document.getElementById('importBackupFileInputEl').files)
                                                if (!res.state) {
                                                    await Swal.fire({
                                                        icon: "error",
                                                        title: "Oops...",
                                                        text: "import failed:" + res.error
                                                    });

                                                    return
                                                }

                                                if (commonStore.documentsGroup !== undefined && commonStore.documentsGroup.length > 0) {
                                                    commonStore.updateCurrentDocumentID(commonStore.documentsGroup[0].id)
                                                }

                                                await initInterfaceData()


                                                commonStore.updateAppCompOpenConfig({
                                                    markdownAppOpen: true,
                                                    processAppOpen: false,
                                                    errorPageAppOpen: false,
                                                    toolboxAppOpen: false,
                                                    PDFReaderAppOpen: false
                                                })

                                                await Swal.fire({
                                                    position: "top-end",
                                                    icon: "success",
                                                    title: "Import backup data success",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });

                                            }}>Confirm
                                            </button>


                                            {/* if there is a button in form, it will close the modal */}
                                            <button className="btn">Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>

                        </ModalContainerComp>
                        <ImportBackupDataIcon id={'ImportBackupDataIconID'} size={'1.5rem'}
                                              className={btnClass + 'cursor-pointer'}
                                              onClick={() => {
                                                  document.getElementById('ImportBackupData_modal').showModal()

                                              }}/>
                    </div>


                    <div className={`${tooltipWrapperClass} ${toolBoxStore.toolboxAppOpenIconState ? null : 'hidden'}`}
                         data-tip='Open toolbox'>

                        <svg onClick={() => {

                            setAppOpenCache(_.cloneDeep(commonStore.appCompOpenConfig))


                            commonStore.updateAppCompOpenConfig({
                                markdownAppOpen: false,
                                processAppOpen: false,
                                errorPageAppOpen: false,
                                toolboxAppOpen: true,
                                PDFReaderAppOpen: false
                            })

                            toolBoxStore.updateToolboxAppOpenIconState(false)


                            buttonGroupID.forEach(item => Utils.setElementDisabled(item, true))

                        }} t="1711625812241"
                             className={btnClass + 'cursor-pointer '}
                             viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="8023" width="1.5rem" height="1.5rem">
                            <path
                                d="M608 768h-192v-96H64v192a128 128 0 0 0 128 128h640a128 128 0 0 0 128-128v-192H608z m176-512H768V179.84a141.76 141.76 0 0 0-128-141.44 1354.56 1354.56 0 0 0-258.56 0A141.76 141.76 0 0 0 256 179.84V256h-16A208 208 0 0 0 32 464V608h384v-96h192v96h384v-144A208 208 0 0 0 784 256zM640 256h-256V179.84a14.4 14.4 0 0 1 12.8-14.4 1226.24 1226.24 0 0 1 230.4 0 14.4 14.4 0 0 1 12.8 14.4z"
                                fill="#231F20" p-id="8024"></path>
                        </svg>

                    </div>


                    <div className={`${tooltipWrapperClass} ${!toolBoxStore.toolboxAppOpenIconState ? null : 'hidden'}`}
                         data-tip='Close toolbox'>

                        <svg onClick={() => {
                            commonStore.updateAppCompOpenConfig(appOpenCache)

                            toolBoxStore.updateToolboxAppOpenIconState(true)


                            initAppIconState()
                        }}
                             t="1711627062940"
                             className={btnClass + 'cursor-pointer ' + `${!toolBoxStore.toolboxAppOpenIconState ? null : 'hidden'}`}
                             viewBox="0 0 1024 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="8994" width="1.5rem" height="1.5rem">
                            <path
                                d="M509.262713 5.474574c281.272162 0 509.262713 228.02238 509.262713 509.262713 0 281.272162-227.990551 509.262713-509.262713 509.262713s-509.262713-227.990551-509.262713-509.262713c0-281.240333 227.990551-509.262713 509.262713-509.262713z m135.050106 278.725849L509.262713 419.250528l-135.050106-135.050105-90.012184 90.012184L419.186871 509.262713l-135.018277 135.081935 90.012184 90.012184L509.262713 599.274897l135.050106 135.050106 90.012184-90.012184L599.274897 509.262713l135.050106-135.050106-90.012184-90.012184z"
                                fill="#4B4B4B" p-id="8995"></path>
                        </svg>

                    </div>


                </div>
            </div>
            <div className='w-screen flex-auto  px-2  '>
                <MarkdownComp/>
                <ProcessComp/>
                <ErrorPage/>
                <ToolboxComp/>
                <div id={'PDFReaderContainer'}
                     className={`${commonStore.appCompOpenConfig.PDFReaderAppOpen ? 'null' : 'hidden'}  h-full`}></div>

            </div>

        </div>
    );
}

export default observer(App);
