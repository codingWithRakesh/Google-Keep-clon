import React, { useState } from 'react';
import { HiPencil } from 'react-icons/hi2';
import { MdDelete, MdLabel, MdOutlineDone } from 'react-icons/md';
import {API_Label} from '../constant/constants.js'
import { useFetchLabel } from '../contexts/FetchLabel.context.jsx';
import fetchNotes from '../utils/FetchLabels.jsx'

const EditLabel = ({ item }) => {
    const [hoveringDelete, setHoveringDelete] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState(item?.labelName);
    const [, setValueLabel] = useFetchLabel()

    const deleteLabel = async () => {
        const { _id, labelName } = item
        console.log(_id, labelName)

        try {
            const response = await fetch(`${API_Label}/deletelable`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body : JSON.stringify({id : _id, labelName})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            console.log("create label ", data.data[0])
            fetchNotes(setValueLabel)
        } catch (error) {
            console.log('Error fetching notes:', error.message);
            throw error
        }
    }

    const updateLabel = async () => {
        setInputFocused(false)
        const { _id } = item

        try {
            const response = await fetch(`${API_Label}/updatelable`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body : JSON.stringify({id : _id, labelName : inputValue})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            fetchNotes(setValueLabel)
        } catch (error) {
            console.log('Error fetching notes:', error.message);
            throw error
        }
    }

    return (
        <div
            className="nameLa w-full h-11 flex items-center justify-between"
            onMouseEnter={() => setHoveringDelete(true)}
            onMouseLeave={() => setHoveringDelete(false)}
        >
            <div onClick={deleteLabel} className="deleteIc h-7 w-7 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                {hoveringDelete ? <MdDelete /> : <MdLabel />}
            </div>
            <input
                type="text"
                value={inputValue}
                className="flex-1 mx-2 focus:border-b focus:border-[rgb(95,99,104)] outline-none bg-transparent text-[#E8EAED] text-[.8rem]"
                onFocus={() => setInputFocused(true)}
                onBlur={updateLabel}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <div onClick={updateLabel} className="tick h-7 w-7 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                {inputFocused ? <MdOutlineDone /> : <HiPencil />}
            </div>
        </div>
    );
};

export default EditLabel;
