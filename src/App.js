import logo from './logo.svg';
import './App.css';
import {TfiSave as SaveIcon} from "react-icons/tfi";
import {SiCodereview as SearchIcon} from "react-icons/si";
import {FaThList as DocumentsIcon} from "react-icons/fa";
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
import {useStore} from "./stores";
import indexedDBEngine from "./indexDBUtils/indexDBUtils";
import ModalContainerComp from "./components/ModalComp/ModalComp";
import React, {useEffect, useState} from "react";
import _ from "lodash";
import MDEditor from "@uiw/react-md-editor";
import ProcessComp from "./components/processComp/processComp";
import useMarkdownHooks from "./components/MarkdownComp/useMarkdownHooks";

function App() {
    const {commonStore} = useStore()
    const currentDocumentObj = commonStore.getCurrentDocumentObj()

    const [addFileName, setAddFileName] = useState('default')
    const [openSearch, setOpenSearch] = useState(false)
    const [openArray, setOpenArray] = useState([])
    const [openExcelDraw, setOpenExcelDraw] = useState(false)
    const [openMarkdown, setOpenMarkdown] = useState(true)

    const {updateMarkdownData} = useMarkdownHooks()


    useEffect(() => {
        commonStore.initDocumentsGroup().then(() => {
            const data = _.cloneDeep(commonStore.documentsGroup.find(item => item.id === commonStore.currentDocumentID)).content
            updateMarkdownData(data)
        })


    }, []);



    document.addEventListener('keydown', async function (event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault(); // 阻止默认行为，即阻止浏览器执行保存操作
            // 在这里编写你的回调函数逻辑
            const res = commonStore.saveIndexedDB()
            if (res) {
                commonStore.setIsDocumentsGroupDataUpdate(false)
            } else {
                commonStore.setIsDocumentsGroupDataUpdate(true)
            }
        }
    });


    return (
        <div id={'app'} className="flex flex-col p-2">
            <div style={{}} className="w-full flex items-center justify-between">
                <div className="flex items-center">
                    <TitleIcon size={'2rem'} className='ml-1'/>
                    <div className='font-bold'>Cookie Data</div>
                </div>

                <div className='flex'>
                    <div className={`font-bold mr-2`}>
                        Document Title: {currentDocumentObj === undefined ? "" : currentDocumentObj.name}
                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip="add document">
                        <ModalContainerComp>
                            <dialog id="addDocument_modal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Title</h3>
                                    <input type="text" placeholder="Type here"
                                           className="mt-2 input input-bordered" style={{width: '100%'}}
                                           value={addFileName} onChange={e => setAddFileName(e.target.value)}/>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            {/* if there is a button in form, it will close the modal */}
                                            <button className="btn" onClick={() => {
                                                const id = crypto.randomUUID()
                                                const name = addFileName
                                                const content = '**Hello** *world*!'
                                                commonStore.addDocumentsGroup({
                                                    id, name, content
                                                })
                                                commonStore.updateCurrentDocumentID(id)

                                            }}>Confirm
                                            </button>

                                            <button className="btn ml-2">Close
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </ModalContainerComp>

                        <AddIcon size={'1.5rem'} className='cursor-pointer'
                                 onClick={() => {
                                     setAddFileName(commonStore.formatTime(new Date()))
                                     document.getElementById('addDocument_modal').showModal()
                                 }}/>
                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip="delete document">
                        <DeleteIcon size={'1.5rem'} className='cursor-pointer' onClick={async () => {
                            commonStore.deleteDocumentsGroup(commonStore.currentDocumentID)
                            const res = await commonStore.saveIndexedDB()
                            if (res) {
                                alert('delete success')
                                if (commonStore.documentsGroup !== undefined && commonStore.documentsGroup.length > 0) {
                                    commonStore.updateCurrentDocumentID(commonStore.documentsGroup[commonStore.documentsGroup.length - 1].id)
                                }
                            } else {
                                alert(`delete failed failed`)
                            }

                        }}/>
                    </div>

                    <div className="tooltip tooltip-left mr-2" data-tip="markdown">
                        <MarkDownIcon size={'1.5rem'} className='cursor-pointer' onClick={async () => {
                            setOpenSearch(false)
                            setOpenExcelDraw(false)
                            setOpenMarkdown(true)
                        }}/>
                    </div>

                    <div className="tooltip tooltip-left mr-2" data-tip="view document list">
                        <DocumentsIcon size={'1.5rem'} className='cursor-pointer ' htmlFor="my-drawer-4"
                                       onClick={() => {
                                           document.getElementById('drawerID').click()
                                           setOpenArray([openMarkdown, openSearch])

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
                                        setOpenMarkdown(openArray[0])
                                        setOpenSearch(openArray[1])

                                    }}></label>
                                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                                        {/* Sidebar content here */}
                                        {commonStore.documentsGroup.slice().reverse().map(item => <li key={item.id}
                                                                                                      className={`${item.id === commonStore.currentDocumentID ? 'bg-blue-100' : null}`}>
                                            <a
                                                onClick={() => {
                                                    commonStore.updateCurrentDocumentID(item.id)
                                                    const data = _.cloneDeep(commonStore.documentsGroup.find(item => item.id === commonStore.currentDocumentID)).content
                                                    updateMarkdownData(data)

                                                }}>{item.name}</a>
                                        </li>)}

                                    </ul>
                                </div>
                            </div>
                        </ModalContainerComp>

                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip='save document'>
                        <SaveIcon size={'1.5rem'} className='mr-1 cursor-pointer'
                                  color={`${commonStore.isDocumentsGroupDataUpdate ? '#fa0404' : '#000'}`}
                                  onClick={async () => {
                                      const res = await commonStore.saveIndexedDB()
                                      if (res) {
                                          alert('save success')
                                          commonStore.setIsDocumentsGroupDataUpdate(false)
                                      } else {
                                          alert(`save failed`)
                                      }
                                  }}/>
                    </div>


                    <div className="tooltip tooltip-left  mr-2" data-tip='export current document'>

                        <SearchIcon size={'1.5rem'} className='cursor-pointer' onClick={() => {
                            setOpenSearch(true)
                            setOpenExcelDraw(false)
                            setOpenMarkdown(false)
                        }}/>
                    </div>

                    <div className="tooltip tooltip-left  mr-2" data-tip='export current document to local desktop'>
                        <ExportIcon size={'1.5rem'} className='cursor-pointer' onClick={() => {
                            commonStore.downloadMarkdown()
                        }}/>
                    </div>


                    <div className="tooltip tooltip-left  mr-2" data-tip='backup all documents to local desktop'>
                        <BackupIcon size={'1.5rem'} className='cursor-pointer' onClick={() => {
                            commonStore.downloadAllData()
                        }}/>
                    </div>
                    <div className="tooltip tooltip-left" data-tip='import backup documents'>
                        <ModalContainerComp>
                            <dialog id="ImportBackupData_modal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">Import backup data</h3>
                                    <input id="fileInput" type="file"
                                           className="file-input file-input-bordered w-full mt-3" multiple
                                           accept=".json" onChange={e => {

                                        commonStore.parsingBackupData(e.target.files)


                                    }}/>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            {/* if there is a button in form, it will close the modal */}
                                            <button className="btn">Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>

                        </ModalContainerComp>
                        <ImportBackupDataIcon size={'1.5rem'} className='cursor-pointer' onClick={() => {
                            document.getElementById('ImportBackupData_modal').showModal()
                        }}/>
                    </div>
                </div>
            </div>
            {openMarkdown ? <MarkdownComp/> : null}


        </div>
    );
}

export default observer(App);
