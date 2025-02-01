
import React, { useRef, useState } from 'react'
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';

const CreateNoteList = ({valueInList,addInValue,valueInBooleanList}) => {
    const [divs, setDivs] = valueInList;
    const [value, setValue] = addInValue;
    const [activeIndex, setActiveIndex] = useState(null);
    const divRefs = useRef([]);
    const [isthrough, setIsthrough] = valueInBooleanList
    console.log("this is first ",divs)

    const setCursorToEnd = (el) => {
        if (el) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);      
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const handleKeyDown = (event, index) => {
        const currentText = divRefs.current[index]?.textContent.trim();

        if (event.key === "Enter") {
            event.preventDefault();
            const nextDivExists = divs[index + 1] !== undefined;

            setDivs((prev) => {
                const updatedDivs = [...prev];
                updatedDivs[index] = currentText; 
                if (!nextDivExists || !prev[index + 1]) {
                    updatedDivs.splice(index + 1, 0, ""); 
                }
                setValue(updatedDivs.join("\n"));
                return updatedDivs;
            });

            setIsthrough((prev) => {
                const updated = [...prev];
                if(updated[index] == undefined){
                    updated[index] = false;
                }
                console.log("update",updated.join("\n"))
                return updated;
            });

            setTimeout(() => {
                if (divRefs.current[index + 1]) {
                    divRefs.current[index + 1].focus();
                    setCursorToEnd(divRefs.current[index + 1]);
                }
            }, 0);
        }

        if (event.key === "Backspace") {
            if (!currentText && divs.length > 1) {
                event.preventDefault();

                setDivs((prev) => prev.filter((_, i) => i !== index)); 

                setTimeout(() => {
                    if (index > 0) {
                        const prevDiv = divRefs.current[index - 1];
                        if (prevDiv) {
                            prevDiv.focus();
                            setCursorToEnd(prevDiv);
                        }
                    }
                }, 0);
            }
        }
    };

    const handleInput = (index) => {
        const currentText = divRefs.current[index]?.textContent;
        console.log(currentText);
        // setDivs((prev) => {
        //     const updatedDivs = [...prev];
        //     updatedDivs[index] = currentText;
        //     return updatedDivs;
        // });
        // setCursorToEnd(divRefs.current[index]);
    };

    const updatedDivs = (index) => {
        console.log("enter inside update divs")
        const currentText = divRefs.current[index]?.textContent;
        setDivs((prev) => {
            prev[index] = currentText;
            setValue(prev.join("\n"));
            console.log("aaaaaaa",prev.join("\n"))
            console.log("value",value)
            return prev;
        });
        // setDivs((value) => {
        //    for(let i = 0; i < divRefs.length; i++){
        //        value[i] = divRefs[i].textContent
        //    }
        //    return value
        // })
    }

    const toggleThrough = (index) => {
        setIsthrough((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            // setValue(updated.join("\n"));
            console.log("update",updated.join("\n"))
            return updated;
        });
    };
 
    return (
        <>
            {divs.map((value, index) => (
                <div
                    key={index}
                    className={`listBox w-full min-h-[2.1rem] max-h-80 overflow-hidden flex flex-wrap justify-center content-start outline-none`}
                >
                    <div
                        className={`boxList relative w-full flex min-h-7 overflow-hidden outline-none px-4 py-1 ${activeIndex === index ? "border-y border-[#ffffff26]" : ""
                            }`}
                    >
                        <div onClick={()=>toggleThrough(index)} className="tickIcon text-[#9AA0A6] centerItem h-6 w-6 mr-2 text-[1.2rem] sticky top-0 left-0">
                            {!isthrough[index] ? (
                                <MdOutlineCheckBoxOutlineBlank />
                            ) : (
                                <MdCheckBox />
                            )}
                        </div>
                        <div
                            ref={(el) => (divRefs.current[index] = el)}
                            className={`wriData flex-1 ${isthrough[index] ? `line-through` : ``} sticky w-full overflow-auto outline-none top-0 right-0`}
                            contentEditable="true"
                              tabIndex={0}
                            suppressContentEditableWarning
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onInput={() => handleInput(index)}
                            onFocus={() => {
                                setActiveIndex(index);
                                setCursorToEnd(divRefs.current[index]);
                            }}
                            onBlur={() => {
                                setActiveIndex(null)
                                updatedDivs(index);
                            }} 
                            dangerouslySetInnerHTML={{ __html: value }}
                        ></div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default CreateNoteList