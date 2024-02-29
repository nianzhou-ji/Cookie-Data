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
import commonStore from "./stores/commonStore/commonStore";
import {useStore} from "./stores";
import indexedDBEngine from "./indexDBUtils/indexDBUtils";
import ModalContainerComp from "./components/ModalComp/ModalComp";
import {useState} from "react";

function App() {
    const {commonStore} = useStore()
    const currentDocumentObj = commonStore.getCurrentDocumentObj()

    const [addFileName, setAddFileName] = useState('default')

    return (
        <div className="flex flex-col pl-1 pr-1 h-screen pt-2 pb-2">
            <div className="flex flee-none items-center justify-between mb-2">
                <div className="flex items-center">
                    <TitleIcon size={'2rem'} className='ml-1'/>
                    <h1 className='font-bold'>Cookie Data</h1>
                </div>

                <div className='flex'>
                    <h1 className={`font-bold mr-2 ${!commonStore.currentDocumentIsSaved ? 'text-red-500' : null}`}>
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
                        <DeleteIcon size={'1.5rem'} className='cursor-pointer' onClick={() => {
                            commonStore.deleteDocumentsGroup(commonStore.currentDocumentID)
                        }}/>
                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip="view document list">
                        <DocumentsIcon size={'1.5rem'} className='cursor-pointer'/>
                    </div>
                    <div className="tooltip tooltip-left mr-2" data-tip='save document'>
                        <SaveIcon size={'1.5rem'} className='mr-1 cursor-pointer' onClick={async () => {
                            commonStore.updateCurrentDocumentIsSaved(true)
                            await indexedDBEngine.open()
                            await indexedDBEngine.add({id: 1, name: 'Item 1'})

                        }}/>
                    </div>

                    <div className="tooltip tooltip-left" data-tip='export current document'>
                        <ExportIcon size={'1.5rem'} className='cursor-pointer '/>
                    </div>

                </div>

            </div>
            <MarkdownComp className='flex-auto'/>
        </div>
    );
}

export default observer(App);
