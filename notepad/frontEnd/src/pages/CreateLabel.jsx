import React, { useEffect, useState } from 'react'
import { HiPencil } from 'react-icons/hi2'
import { MdDelete, MdLabel, MdOutlineDone } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import EditLabel from '../components/EditLabel'
import {API_URL,API_Label} from '../constant/constants.js'
import { useLabel } from '../contexts/EditLabel.context.jsx'
import { useFetchLabel } from '../contexts/FetchLabel.context.jsx'
import fetchNotes from '../utils/FetchLabels.jsx'

const CreateLabel = () => {
    const [valueLabel, setValueLabel] = useFetchLabel()
    const [isLabel, setIsLabel] = useLabel()

    useEffect(() => {
        fetchNotes(setValueLabel);
    }, []);

    const [makeLabel, setMakeLabel] = useState("")
    const makeLabelFun = async () => {
        try {
            const response = await fetch(`${API_Label}/createlabel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body : JSON.stringify({"labelName" : makeLabel})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            // console.log(data)
            fetchNotes(setValueLabel);
        } catch (error) {
            // console.error('Error fetching notes:', error.message);
            throw error
        }
    }

    return (

        <div className="label w-[17.5rem] min-h-[9.5rem] bg-[#313235] flex flex-wrap justify-center content-between">
            <div className="makeL w-full min-h-[6rem] p-4 flex flex-wrap justify-center content-start">
                <div className="header w-full h-6 flex items-center justify-start text-[#E8EAED]">
                    Edit labels
                </div>
                <div className="nameLa w-full h-11 flex items-center justify-between">
                    <div className="deleteIc h-7 w-7 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]"><RxCross2 /></div>
                    <input name='labelName' value={makeLabel} onChange={(e)=>setMakeLabel(e.target.value)} type="text" className='flex-1 mx-2 border-b border-[rgb(95,99,104)] outline-none bg-transparent text-[#E8EAED] text-[.8rem]' />
                    <div onClick={makeLabelFun} className="tick h-7 w-7 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]"><MdOutlineDone /></div>
                </div>
                {
                    valueLabel && valueLabel?.map((v,i) => (
                        <EditLabel item={v} key={i} />
                    ))
                }

            </div>
            <div className="done w-full h-[4rem] flex items-center justify-end border-t py-4 px-3 border-[rgb(95,99,104)]">
                <button onClick={() => setIsLabel((v) => !v)} className='h-9 w-[5.226rem] text-sm text-[#DADCE0] font-bold hover:bg-[#e8eaed14]'>
                    Done
                </button>
            </div>
        </div>

    )
}

export default CreateLabel