import React, { useEffect, useState } from 'react'
import { BiArchiveIn, BiArchiveOut, BiRedo, BiUndo } from 'react-icons/bi'
import { BsPin, BsPinFill, BsStars } from 'react-icons/bs'
import { HiOutlinePencil } from 'react-icons/hi2'
import { MdDelete, MdDeleteForever, MdOutlineCheckBox, MdOutlineImage, MdOutlinePalette, MdOutlineUnarchive, MdRestoreFromTrash } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import CreateNoteList from './CreateNoteList'
import imgD from "../assets/images/img.jpg";
import { useNavigate, useParams } from 'react-router-dom'
import CreateNoteText from './CreateNoteText'
import { API_NOTE } from '../constant/constants'
import { useFetchLabel } from '../contexts/FetchLabel.context'
import { format } from 'date-fns';
import { useMainContainer } from '../contexts/FetchMainContainer'
import fetchMainContainerNotes from '../utils/FetchMainContainer'
import { useLabelNote } from '../contexts/FetchLabelNote.context'
import fetchLabelsNotes from '../utils/FetchLabelsNote'
import { useArchive } from '../contexts/FetchArchive.context'
import fetchArchiveNotes from '../utils/FetchArchive'
import { useBin } from '../contexts/FetchBin.context'
import fetchBinNotes from '../utils/FetchBin'
import { handleError } from './ErrorMessage'
import { GoogleGenerativeAI } from "@google/generative-ai";
import loader from '../assets/loader/loader.gif'

const UpdateNote = () => {
    const [valueAPI, setValueAPI] = useState(null);
    const paramsdata = useParams();
    const [isPinV, setIsPinV] = useState(false)
    const [file, setFile] = useState(null);

    const [value, setValue] = useState("");
    const [list, setList] = useState(value.split("\n"));
    const [listBoolean, setListBoolean] = useState([])

    const [clickList1, setClickList1] = useState(false);
    const [apiCompleted, setApiCompleted] = useState(false)
    const [title, setTitle] = useState("")
    const navigate = useNavigate();
    const [, setValueMain] = useMainContainer()

    const [, setLabelNoteValue] = useLabelNote()
    const [, setArchiveNote] = useArchive()
    const [, setBinNote] = useBin()

    const [loadingC, setLoadingC] = useState(false)

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
            // console.log('Fetched data: ', data.data[0]);
            setValueAPI(data.data[0]);
            const responseData = data.data[0]

            const listCon = responseData?.listContent?.map(v => v?.split(","))?.flat();
            // console.log("40 listCon ", listCon)
            setTitle(responseData?.title)
            setIsPinV(responseData?.isPin)
            setListBoolean(responseData?.listBoolean)
            setValue(responseData?.content || listCon?.join("\n"));
            if (responseData.content) {
                setList(responseData.content?.split("\n") || [""]);
            } else {
                setList(listCon || [""]);
            }

            // console.log("responseData.content ", responseData?.content)
            // console.log("45 value ", value)
            if (responseData?.content) {
                setClickList1(false)
            } else {
                setClickList1(true)
            }
            setApiCompleted(true)
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    };

    // console.log("content kjhadkhakhahdj ", valueAPI)
    // console.log("listContent",valueAPI?.listContent)

    const inArchive = async () => {
        try {
            const response = await fetch(`${API_NOTE}/archivenote/${paramsdata.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchMainContainerNotes(setValueMain)
            if (valueAPI?.isLabel) {
                fetchLabelsNotes(setLabelNoteValue, valueAPI?.labelName)
            }
            navigate(-1)
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    const outArchive = async () => {
        try {
            const response = await fetch(`${API_NOTE}/restorearchivenote/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id: paramsdata.id })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchArchiveNotes(setArchiveNote)
            if (valueAPI?.isLabel) {
                fetchLabelsNotes(setLabelNoteValue, valueAPI?.labelName)
            }
            navigate(-1)
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    const inBin = async () => {
        // console.log("enter in inBin")
        try {
            const response = await fetch(`${API_NOTE}/binnote/${paramsdata.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchMainContainerNotes(setValueMain)
            if (valueAPI?.isArchive) {
                fetchArchiveNotes(setArchiveNote)
            }
            // console.log("valueAPI?.isLabel ", valueAPI?.isLabel)
            if (valueAPI?.isLabel) {
                fetchLabelsNotes(setLabelNoteValue, valueAPI?.labelName)
            }
            navigate(-1)
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    const outBin = async () => {
        try {
            const response = await fetch(`${API_NOTE}/restorebinnote/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id: paramsdata.id })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchBinNotes(setBinNote)
            navigate(-1)
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    const deleteNote = async () => {
        try {
            const response = await fetch(`${API_NOTE}/deletenote/${paramsdata.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchBinNotes(setBinNote)
            navigate(-1)
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    const reUploadFile = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {

            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(selectedFile.type)) {
                handleError("only image allow")
                event.target.value = "";
                return;
            }

            const maxSizeInBytes = 4 * 1024 * 1024;
            if (selectedFile.size > maxSizeInBytes) {
                handleError("Image size must be less than 4 MB.")
                event.target.value = "";
                return;
            }

            setFile(selectedFile);
        }
    }

    const uploadSubmit = async () => {
        if (!file) {
            // console.log("Please select a file first!")
            throw new Error("Please select a file first!")
        }

        const formData = new FormData();
        formData.append("image", file);

        // for (const pair of formData.entries()) {
        //     console.log("realform data", pair[0], pair[1]);  // Log actual FormData content
        // }
        // console.log("real form data ", formData)
        try {
            const response = await fetch(`${API_NOTE}/reuploadfile/${paramsdata.id}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchNotes();
            if (valueAPI?.isArchive) {
                fetchArchiveNotes(setArchiveNote)
            }
            if (valueAPI?.isLabel) {
                fetchLabelsNotes(setLabelNoteValue, valueAPI?.labelName)
            }
        } catch (error) {
            // console.log('Error fetching notes:', error.message);
            throw error
        }
    }

    useEffect(() => {
        fetchNotes();
        if (file) {
            uploadSubmit()
        }

    }, [file]);

    const updateAllValue = async () => {

        // console.log("title ", title)
        // console.log("content ", value)
        // console.log("listContent ", list)
        // console.log("listContentBoolean ", listBoolean)
        // console.log("ispin ", isPinV)

        const updateOBJ = {
            title,
            content: clickList1 ? "" : value,
            listContent: clickList1 ? list : [],
            listBoolean: clickList1 ? listBoolean.splice(0, list.length) : [],
            isPin: isPinV
        }
        // console.log(updateOBJ)

        try {
            setLoadingC(true)
            const response = await fetch(`${API_NOTE}/updatetextnote/${paramsdata.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updateOBJ)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchNotes();
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
        if (valueAPI?.isArchive) {
            fetchArchiveNotes(setArchiveNote)
        }
        if (valueAPI?.isLabel) {
            fetchLabelsNotes(setLabelNoteValue, valueAPI?.labelName)
        }
        fetchMainContainerNotes(setValueMain)
        setLoadingC(false)
        navigate(-1)
    }

    const toogleListValue = () => {
        setClickList1((v) => !v)
        setListBoolean((v) => {
            let boolArray = []
            for (let i = 0; i < list.length; i++) {
                boolArray.push(false)
            }
            return boolArray
        })
    }

    const deleteFile = async (imgS) => {
        try {
            const response = await fetch(`${API_NOTE}/deletefile/${paramsdata.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ image: imgS })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log('Fetched Archive data: ', data);
            fetchNotes();
            if (valueAPI?.isArchive) {
                fetchArchiveNotes(setArchiveNote)
            }
            if (valueAPI?.isLabel) {
                fetchLabelsNotes(setLabelNoteValue, valueAPI?.labelName)
            }
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    // const API_KEY = import.meta.env.VITE_API_KEY;
    const fetchResponse = async () => {
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `${value} Given the following text, generate a concise and compelling title in a single line that accurately represents its essence. The title should be engaging, informative, and suitable for an article, book, or presentation. max_tokens: 10`;
            const result = await model.generateContent(prompt);
            setTitle(result.response.text());
        } catch (error) {
            console.error("Error generating AI response:", error);
            setTitle("Failed to get a response.");
        }
    };

    return (
        <div className='w-[34rem] overflow-x-auto max-h-[32rem] flex flex-wrap justify-center content-between min-h-[10.5rem] bg-[rgb(32,33,36)] shadow-[inset 1px 1px 0 rgba(0, 0, 0, .1), inset 0 -1px 0 rgba(0, 0, 0, .07)] rounded-lg border relative border-[rgb(95,99,104)]'>
            {valueAPI?.image?.length > 0 && <div className="imgBox flex flex-wrap justify-center items-center w-full min-h-0 ">
                {valueAPI.image?.map((imgS, i) => (<div key={i} className={valueAPI.image?.length === 4 ? "w-1/2 h-1/2 centerItem relative group" : valueAPI.image?.length === 3 ? "w-1/2 h-1/2 centerItem relative group" : valueAPI.image?.length === 2 ? "w-1/2 h-full centerItem relative group" : "w-full h-full centerItem relative group"} > <img src={imgS} className='h-full w-full object-cover' /> <div onClick={() => deleteFile(imgS)} className='h-8 w-8 bg-[rgba(0,0,0,.6)] absolute bottom-2 right-2 text-[#fff] centerItem rounded-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'> <MdDelete /> </div> </div>))}
            </div>}
            <div className="titleInputPin flex items-center justify-between h-11 w-full py-[.525rem] px-[.838rem]">
                <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder='Title' className='bg-transparent flex-1 outline-none text-[#E8EAED]' disabled={valueAPI?.isBin} />

                {(value.length > 50 && !valueAPI?.isBin) && <div onClick={fetchResponse} className={`ml-3 ${!valueAPI?.image?.length > 0 ? `mr-8` : ``} h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.3rem] hover:text-[#E8EAED] text-[#9AA0A6]`}>
                    <BsStars />
                </div>}

                {!valueAPI?.isBin && <div onClick={() => setIsPinV((v) => !v)} className="ml-3 h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.3rem] hover:text-[#E8EAED] text-[#9AA0A6] absolute right-2 top-2">
                    {!isPinV ? <BsPin /> : <BsPinFill />}
                </div>}
            </div>
            <div className="outline-none flex flex-wrap justify-start items-start content min-h-8 mt-1 mb-2 w-full text-[#E8EAED]">
                {!clickList1 && <CreateNoteText valueInString={[value, setValue]} addInList={[list, setList]} apiCompleted={apiCompleted} isBin={valueAPI?.isBin} />}
                {clickList1 && <CreateNoteList valueInList={[list, setList]} addInValue={[value, setValue]} valueInBooleanList={[listBoolean, setListBoolean]} isBin={valueAPI?.isBin} />}
            </div>
            <div className="timeIng w-full h-9 flex items-center justify-between px-3">
                <div className={`min-h-5 px-2 py-1 rounded-3xl w-auto centerItem text-[11px] text-[#E8EAED] ${valueAPI?.isLabel ? `border border-[rgb(95,99,104)]` : ``}`}>
                    {valueAPI?.isLabel && valueAPI?.labelName}
                </div>
                <div className='h-full flex items-center justify-end w-auto text-[#FFFFFFCC] text-[.75rem]'>
                    {valueAPI?.updatedAt && format(new Date(valueAPI?.updatedAt), 'HH:mm:ss')}
                </div>
            </div>
            <div className="toolCon w-full h-10 flex items-center justify-between px-2 bg-[rgb(32,33,36)] z-10 rounded-b-md sticky bottom-0">
                <div className="leftCon flex items-center gap-4">
                    {!valueAPI?.isBin && <> <div className="insertImg h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <label htmlFor="fileId" className=' cursor-pointer'><MdOutlineImage /></label>
                        <input type="file" id='fileId' onChange={reUploadFile} className=' hidden' disabled={valueAPI?.image?.length >= 4} />
                    </div>
                        {valueAPI?.isArchive ? <div onClick={outArchive} className="setArchive h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <BiArchiveOut />
                        </div> :
                            <div onClick={inArchive} className="setArchive h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                                <BiArchiveIn />
                            </div>}
                        <div onClick={toogleListValue} className="listDat h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <MdOutlineCheckBox />
                        </div>
                        <div className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-not-allowed text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <MdOutlinePalette />
                        </div>
                        <div onClick={inBin} className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <RiDeleteBin6Line />
                        </div>
                        <div className="colorPalet h-8 w-8 rounded-full centerItem hover:cursor-not-allowed text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <HiOutlinePencil />
                        </div>
                        <div className="undo h-8 w-8 rounded-full centerItem hover:cursor-not-allowed text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <BiUndo />
                        </div>
                        <div className="redo h-8 w-8 rounded-full centerItem hover:cursor-not-allowed text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <BiRedo />
                        </div> </>}

                    {valueAPI?.isBin && <><div onClick={deleteNote} className="redo h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <MdDeleteForever />
                    </div>
                        <div onClick={outBin} className="redo h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1.1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <MdRestoreFromTrash />
                        </div></>}
                </div>
                <button
                    disabled={loadingC}
                    onClick={updateAllValue}
                    className="rightCancel mr-3 text-sm hover:cursor-pointer rounded centerItem text-[#DADCE0] text-center h-8 min-w-14 hover:bg-[#e8eaed14]"
                >
                    {!loadingC ? `Close`
                    :
                    <img src={loader} className="h-7 w-7 " />}
                </button>
            </div>
        </div>
    )
}

export default UpdateNote