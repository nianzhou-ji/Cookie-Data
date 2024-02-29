import logo from './logo.svg';
import './App.css';
import {TfiSave as SaveIcon} from "react-icons/tfi";
import {SiCodereview as DocumentsIcon} from "react-icons/si";
import {FaFileExport as ExportIcon} from "react-icons/fa";
import {SiCookiecutter as TitleIcon} from "react-icons/si";
import {IoMdAddCircle as AddIcon} from "react-icons/io";
import {AiFillDelete as DeleteIcon} from "react-icons/ai";
import {observer} from "mobx-react-lite";
import MarkdownComp from "./components/MarkdownComp/MarkdownComp";
import {useStore} from "./stores";
import indexedDBEngine from "./indexDBUtils/indexDBUtils";
import ModalContainerComp from "./components/ModalComp/ModalComp";
import {useEffect, useState} from "react";
import _ from "lodash";

function App() {
    const {commonStore} = useStore()
    const currentDocumentObj = commonStore.getCurrentDocumentObj()

    const [addFileName, setAddFileName] = useState('default')

    useEffect(() => {
        commonStore.initDocumentsGroup()
    }, []);

    return (
        <div className="flex flex-col pl-1 pr-1 h-screen pt-2 pb-2 w-screen">
            <div className="flex flee-none items-center justify-between mb-2">
                <div className="flex items-center">
                    <TitleIcon size={'2rem'} className='ml-1'/>
                    <h1 className='font-bold'>Cookie Data</h1>
                </div>

                <div className='flex'>
                    <h1 className={`font-bold mr-2`}>
                        Document Title: {currentDocumentObj === undefined ? "" : currentDocumentObj.name}
                    </h1>
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
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </ModalContainerComp>

                        <AddIcon size={'1.5rem'} className='cursor-pointer'
                                 onClick={() => document.getElementById('addDocument_modal').showModal()}/>
                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip="delete document">
                        <DeleteIcon size={'1.5rem'} className='cursor-pointer' onClick={async () => {
                            commonStore.deleteDocumentsGroup(commonStore.currentDocumentID)

                            try {
                                await indexedDBEngine.open()
                                await indexedDBEngine.delete(1)
                                await indexedDBEngine.add({
                                    id: 1,
                                    documentsGroup: _.cloneDeep(commonStore.documentsGroup)
                                })
                                alert('delete success')
                                if(commonStore.documentsGroup!==undefined && commonStore.documentsGroup.length>0){
                                    commonStore.updateCurrentDocumentID(commonStore.documentsGroup[0].id)
                                }
                            } catch (e) {
                                alert(`delete failed ${e}`)
                            }

                        }}/>
                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip="view document list">
                        <DocumentsIcon size={'1.5rem'} className='cursor-pointer' htmlFor="my-drawer-4" onClick={() => {
                            document.getElementById('drawerID').click()
                        }}/>

                        <ModalContainerComp>
                            <div className="drawer">
                                <input id="my-drawer-4" type="checkbox" className="drawer-toggle"/>
                                <div className="drawer-content">
                                    {/* Page content here */}
                                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary hidden"
                                           id={'drawerID'}>Open drawer</label>
                                </div>
                                <div className="drawer-side">
                                    <label htmlFor="my-drawer-4" aria-label="close sidebar"
                                           className="drawer-overlay"></label>
                                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                                        {/* Sidebar content here */}
                                        {commonStore.documentsGroup.map(item => <li key={item.id}
                                                                                    className={`${item.id === commonStore.currentDocumentID ? 'bg-blue-100' : null}`}>
                                            <a
                                                onClick={() => commonStore.updateCurrentDocumentID(item.id)}>{item.name}</a>
                                        </li>)}

                                    </ul>
                                </div>
                            </div>
                        </ModalContainerComp>

                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip='save document'>
                        <SaveIcon size={'1.5rem'} className='mr-1 cursor-pointer' onClick={async () => {
                            try {
                                await indexedDBEngine.open()
                                await indexedDBEngine.delete(1)
                                await indexedDBEngine.add({
                                    id: 1,
                                    documentsGroup: _.cloneDeep(commonStore.documentsGroup)
                                })
                                alert('save success')
                            } catch (e) {
                                alert(`save failed ${e}`)
                            }

                        }}/>
                    </div>

                    <div className="tooltip tooltip-left" data-tip='export current document'>
                        <ExportIcon size={'1.5rem'} className='cursor-pointer' onClick={()=>{
                            commonStore.downloadMarkdown()
                        }}/>
                    </div>

                </div>

            </div>
            <MarkdownComp className='flex-auto'/>
        </div>
    );
}

export default observer(App);
