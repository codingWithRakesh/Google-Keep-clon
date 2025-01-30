import React, { useState } from 'react';
import { HiPencil } from 'react-icons/hi2';
import { MdDelete, MdLabel, MdOutlineDone } from 'react-icons/md';

const EditLabel = ({item}) => {
    const [hoveringDelete, setHoveringDelete] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState(item?.labelName);

    return (
        <div
            className="nameLa w-full h-11 flex items-center justify-between"
            onMouseEnter={() => setHoveringDelete(true)}
            onMouseLeave={() => setHoveringDelete(false)}
        >
            <div className="deleteIc h-7 w-7 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                {hoveringDelete ? <MdDelete /> : <MdLabel />}
            </div>
            <input
                type="text"
                value={inputValue}
                className="flex-1 mx-2 focus:border-b focus:border-[rgb(95,99,104)] outline-none bg-transparent text-[#E8EAED] text-[.8rem]"
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="tick h-7 w-7 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                {inputFocused ? <MdOutlineDone /> : <HiPencil />}
            </div>
        </div>
    );
};

export default EditLabel;
