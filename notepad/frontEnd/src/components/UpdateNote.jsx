import React, { useEffect, useState } from 'react'
import { BiArchiveIn, BiRedo, BiUndo } from 'react-icons/bi'
import { BsPin, BsPinFill } from 'react-icons/bs'
import { HiOutlinePencil } from 'react-icons/hi2'
import { MdOutlineCheckBox, MdOutlineImage, MdOutlinePalette } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CreateNoteList from './CreateNoteList'
import imgD from "../assets/images/img.jpg";
import { useNavigate, useParams } from 'react-router-dom'
import CreateNoteText from './CreateNoteText'
import { API_NOTE } from '../constant/constants'

const UpdateNote = () => {
    const [valueAPI, setValueAPI] = useState(null);
    const paramsdata = useParams();

    const [value, setValue] = useState("");
    const [list, setList] = useState(value.split("\n"));
    const [clickList1, setClickList1] = useState(false);
    const [apiCompleted, setApiCompleted] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch(`${API_NOTE}/note/${paramsdata.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch notes');
                }

                const data = await response.json();
                console.log('Fetched data: ', data.data[0]);
                setValueAPI(data.data[0]);
                const responseData = data.data[0]

                const listCon = responseData?.listContent?.map(v => v?.split(","))?.flat();
                console.log("40 listCon ",listCon)
                setValue(responseData?.content || listCon?.join("\n"));
                if(responseData.content){
                    setList(responseData.content?.split("\n") || [""]);
                } else {
                    setList(listCon || [""]);
                }
                
                console.log("responseData.content ", responseData?.content)
                console.log("45 value ", value)
                if(responseData?.content){
                    setClickList1(false)
                }else{
                    setClickList1(true)
                }
                setApiCompleted(true)
            } catch (error) {
                console.error('Error fetching notes:', error.message);
            }
        };

        fetchNotes();
    }, []);
    // console.log("content",valueAPI?.content)
    // console.log("listContent",valueAPI?.listContent)


    useEffect(() => {

    }, []);
    const [title, setTitle] = useState()

    return (
        <div className='w-[34rem] overflow-x-auto max-h-[32rem] flex flex-wrap justify-center content-between min-h-[10.5rem] bg-[rgb(32,33,36)] shadow-[inset 1px 1px 0 rgba(0, 0, 0, .1), inset 0 -1px 0 rgba(0, 0, 0, .07)] rounded-lg border relative border-[rgb(95,99,104)]'>
            {valueAPI?.image?.length > 0 && <div className="imgBox flex flex-wrap justify-center items-center w-full min-h-0 ">
                {valueAPI.image?.map((imgS, i) => (<img key={i} src={imgS} className={valueAPI.image?.length === 4 ? "w-1/2 h-1/2 object-cover" : valueAPI.image?.length === 3 ? "w-1/2 h-1/2 object-cover" : valueAPI.image?.length === 2 ? "w-1/2 h-full object-cover" : "w-full h-full object-cover"} />))}
            </div>}
            <div className="titleInputPin flex items-center justify-between h-11 w-full py-[.525rem] px-[.838rem]">
                <input type="text" onChange={(e) => setTitle(e.target.value)} value={valueAPI?.title} placeholder='Title' className='bg-transparent flex-1 outline-none text-[#E8EAED]' />
                <div className="ml-3 h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.3rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                    {!valueAPI?.isPin ? <BsPin /> : <BsPinFill />}
                </div>
            </div>
            <div className="outline-none flex flex-wrap justify-start items-start content min-h-8 mt-1 mb-2 w-full text-[#E8EAED]">
                {!clickList1 && <CreateNoteText valueInString={[value, setValue]} addInList={[list, setList]} apiCompleted={apiCompleted} />}
                {clickList1 && <CreateNoteList valueInList={[list, setList]} addInValue={[value, setValue]} />}
            </div>
            <div className="timeIng w-full h-9 flex items-center justify-between px-3">
                <div className={`min-h-5 px-2 py-1 rounded-3xl w-auto centerItem text-[11px] text-[#E8EAED] ${valueAPI?.isLabel ? `border border-[rgb(95,99,104)]` : ``}`}>
                    {valueAPI?.isLabel && valueAPI?.labelName}
                </div>
                <div className='h-full flex items-center justify-end w-auto text-[#FFFFFFCC] text-[.75rem]'>
                    Edited at 00:49
                </div>
            </div>
            <div className="toolCon w-full h-10 flex items-center justify-between px-2 bg-[rgb(32,33,36)] z-10 rounded-b-md sticky bottom-0">
                <div className="leftCon flex items-center gap-4">
                    <div className="insertImg h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <MdOutlineImage />
                    </div>
                    <div className="setArchive h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <BiArchiveIn />
                    </div>
                    <div onClick={() => setClickList1((v) => !v)} className="listDat h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <MdOutlineCheckBox />
                    </div>
                    <div className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <MdOutlinePalette />
                    </div>
                    <div className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <RiDeleteBin6Line />
                    </div>
                    <div className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <HiOutlinePencil />
                    </div>
                    <div className="undo h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <BiUndo />
                    </div>
                    <div className="redo h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <BiRedo />
                    </div>
                </div>
                <div
                    onClick={() => navigate(-1)}
                    className="rightCancel mr-3 text-sm hover:cursor-pointer rounded centerItem text-[#DADCE0] text-center h-8 w-14 hover:bg-[#e8eaed14]"
                >
                    Close
                </div>
            </div>
        </div>
    )
}

export default UpdateNote