import React, { useState, useRef } from 'react';
import { MdOutlineImage, MdOutlinePalette, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { BsPin, BsPinFill } from 'react-icons/bs';
import { BiArchiveIn, BiArchiveOut, BiRedo, BiUndo } from 'react-icons/bi';
import imgD from "../assets/images/img.jpg";
import cover from "../assets/images/cover.jpg";
import List from './List';
import CreateNoteList from './CreateNoteList';
import CreateNoteText from './CreateNoteText';
import { useParams } from 'react-router-dom';
import {API_NOTE} from '../constant/constants.js'
import { useMainContainer } from '../contexts/FetchMainContainer.jsx';
import fetchMainContainerNotes from '../utils/FetchMainContainer.jsx';

const CreateNote = () => {
    const [check, setCheck] = useState(true);
    const [value, setValue] = useState("");
    const [list, setList] = useState(value.split("\n"));
    const [listBoolean, setListBoolean] = useState([])
    const [isPinV, setIsPinV] = useState(false)
    const [titleV, setTitleV] = useState("")
    const [isArchiveV, setIsArchiveV] = useState(false)
    const [file, setFile] = useState(null)
    const [valueMain, setValueMain] = useMainContainer()

    const [clickList, setClickList] = useState(false);
    const img = [imgD, imgD];
    // console.log("value",value.split("\n"));
    // console.log("list",list)
    const paramsdata = useParams();

    const toogleListValue = () => {
        setClickList((v) => !v)
        setListBoolean((v) => {
            let boolArray = []
            for (let i = 0; i < list.length; i++) {
                boolArray.push(false)
            }
            return boolArray
        })
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const createNoteContent = async () => {
        console.log("pin ", isPinV)
        console.log("title ", titleV)
        console.log("archive ", isArchiveV)
        console.log("content ", value)
        console.log("listContent ", list)
        console.log("listBoolean ", listBoolean)

        const formData = new FormData();

        formData.append('title', titleV);
        formData.append('isPin', isPinV)
        formData.append('isArchive', isArchiveV)
        formData.append('content', clickList ? "" : value)
        formData.append('listContent', JSON.stringify(clickList ? list : [""]))
        formData.append('listBoolean', JSON.stringify(clickList ? listBoolean.splice(0, list.length) : []))
        if (file) {
            formData.append('image', file);
        }
        if(paramsdata.label){
            formData.append('labelName', paramsdata.label);
        }

        try {
            const response = await fetch(`${API_NOTE}/createnote/`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            console.log('Fetched Archive data: ', data);
        } catch (error) {
            console.error('Error fetching notes:', error.message);
        }
        setCheck((v) => !v)
        fetchMainContainerNotes(setValueMain)
    }

    return (
        <div
            className="w-[37rem] mt-8 bg-[rgb(32,33,36)] border border-[rgb(95,99,104)] rounded-md text-[#E8EAED]">
            {check && <div className='w-full h-full flex items-center justify-between gap-2 px-3'>
                <textarea onClick={() => { setCheck((v) => !v) }} name="" id="" className='text-sm border outline-none border-none resize-none bg-transparent h-9 w-52 flex-1 py-[.5rem]' placeholder='Take a note...'></textarea>

                <div className="tickList h-9 w-9 text-[#9AA0A6] rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.3rem] hover:text-[#E8EAED]">
                    <MdOutlineCheckBox />
                </div>
                <div className="imgUpload h-9 w-9 text-[#9AA0A6] rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.3rem] hover:text-[#E8EAED]">
                    <MdOutlineImage />
                </div>
            </div>}
            {!check && (
                <div className="writeNoteBox w-full overflow-hidden min-h-[7.5rem] flex flex-wrap content-between justify-center relative">
                    <div className="textCon w-full flex-1 px-[.2rem] overflow-y-auto relative">
                        <div className="imgBox flex flex-wrap justify-center items-center w-full min-h-0 sticky top-0 left-0">
                            {/* {img.map((imgS, i) => (<img key={i} src={imgS} className={img.length === 4 ? "w-1/2 h-1/2 object-cover" : img.length === 3 ? "w-1/2 h-1/2 object-cover" : img.length === 2 ? "w-1/2 h-full object-cover" : "w-full h-full object-cover"} />))} */}
                        </div>
                        <div className="titleInputPin flex items-center justify-between h-11 w-full py-[.525rem] px-[.838rem] sticky top-0">
                            <input type="text" onChange={(v) => setTitleV(v.target.value)} value={titleV} placeholder='Title' className='bg-transparent flex-1 outline-none' name='title' />
                            <div onClick={() => setIsPinV((v) => !v)} className="ml-3 pinBox h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.3rem] hover:text-[#E8EAED]">
                                {isPinV ? <BsPinFill /> : <BsPin />}
                            </div>
                        </div>

                        <div className=' w-full max-h-80 overflow-y-auto'>
                            {!clickList && <CreateNoteText valueInString={[value, setValue]} addInList={[list, setList]} />}
                            {clickList && <CreateNoteList valueInList={[list, setList]} addInValue={[value, setValue]} valueInBooleanList={[listBoolean, setListBoolean]} />}
                        </div>

                    </div>

                    {paramsdata.label && <div className="showlabel mt-4 w-full px-3 h-10 flex items-center justify-start sticky top-0 left-0">
                        <div className="min-h-5 px-2 py-1 rounded-3xl w-auto centerItem text-[11px] text-[#E8EAED] border border-[rgb(95,99,104)]">
                            {paramsdata.label}
                        </div>
                    </div>}

                    <div className="toolCon w-full h-9 flex items-center justify-between px-2 bg-[rgb(32,33,36)] z-10 rounded-b-md sticky bottom-0">
                        <div className="leftCon flex items-center gap-4">
                            <div className="insertImg h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                <label htmlFor="fileId" className='cursor-pointer'><MdOutlineImage /></label>
                                <input type="file" onChange={handleFileChange} id='fileId' className='hidden' />
                            </div>
                            <div onClick={() => setIsArchiveV((e) => !e)} className="setArchive h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                {isArchiveV ? <BiArchiveIn /> : <BiArchiveOut />}
                            </div>
                            <div onClick={toogleListValue} className="listDat h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                <MdOutlineCheckBox />
                            </div>
                            <div className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                <label htmlFor="colorId" className='cursor-pointer'><MdOutlinePalette /></label>
                                <input type="color" id='colorId' className=' hidden' />
                            </div>
                            <div className="undo h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                <BiUndo />
                            </div>
                            <div className="redo h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                <BiRedo />
                            </div>
                        </div>
                        <div
                            onClick={createNoteContent}
                            className="rightCancel mr-3 text-sm hover:cursor-pointer rounded centerItem text-center h-8 w-14 hover:bg-[#e8eaed14]"
                        >
                            Close
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateNote;
