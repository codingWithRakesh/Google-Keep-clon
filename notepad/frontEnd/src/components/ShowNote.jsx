import React, { useEffect, useRef } from "react";
import { BiArchiveIn, BiArchiveOut, BiRedo, BiUndo } from "react-icons/bi";
import { BsPin, BsPinFill } from 'react-icons/bs';
import { HiOutlinePencil } from "react-icons/hi2";
import { MdDeleteForever, MdOutlineCheckBox, MdOutlineImage, MdOutlinePalette, MdRestoreFromTrash } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useView } from "../contexts/View.context.jsx";
import List from "./List.jsx";
import { Link, useLocation } from "react-router-dom";

const ShowNote = ({ item }) => {
    const result = item.listContent?.map((label, index) => ({
        label,
        isCheck: item?.listBoolean[index]
    }));
    const [view] = useView();
    const location = useLocation();
    const contentRef = useRef(null)

    const contentRefNew = useRef(null)
    useEffect(() => {
        const valueR = item.content.replace(/\n/g, "<div>").replace('&lt;', "<").replace('&gt;', '>') //.replace(/ /g, "&nbsp;");
        contentRefNew.current.innerHTML = valueR;
        // console.log("valueR ", valueR)
    }, [item]);
    // if (item.listContent.length == 0) {
    // let valueR = item?.content?.replace(/\n/g, "</br>")
    // contentRef.current.innerHTML = valueR
    // }
    return (
        <Link to={`${location.pathname === "/" ? "" : location.pathname}/NOTE/${item._id}`} className={`notesData group ${view ? `w-full` : `w-[60%]`} flex flex-wrap justify-center content-between h-auto ${view ? `max-h-[32rem]` : `max-h-[42rem]`} min-h-24 border relative border-[rgb(95,99,104)] rounded-lg mb-4`}>
            <div className={`pin absolute top-2 right-1 h-8 w-8 z-10 centerItem pin text-[1.3rem] hover:cursor-pointer ${item.image.length ? `text-[#E8EAED] hover:text-[#9AA0A6]` : `text-[#9AA0A6] hover:text-[#E8EAED]`} opacity-0 group-hover:opacity-100 transition-opacity`}>
                {item.image.length || !item.isPin ? <BsPin /> : <BsPinFill />}
            </div>
            <div className="images flex sticky flex-wrap items-center justify-center top-0 left-0 w-full">
                {item.image?.map((imgS, i) => (
                    <img key={i} src={imgS} className={item.image?.length === 4 ? "w-1/2 h-1/2 object-cover" : item.image?.length === 3 ? "w-1/2 h-1/2 object-cover" : item.image?.length === 2 ? "w-1/2 h-full object-cover" : "w-full h-full object-cover"} />
                ))}
            </div>
            {item.title && <div className="noteTitle leading-relaxed flex items-center justify-between font-bold pt-2 px-4 w-full text-[1rem] min-h-[2.375rem] sticky top-0 left-0 text-[#E8EAED]">
                <div className="flex-1">{item.title}</div>
            </div>}
            {(item.content || item.listContent.length > 0) && <div style={{ whiteSpace: 'pre-wrap' }} ref={contentRef} className="noteContent overflow-hidden text-ellipsis line-clamp-10 py-3 text-[0.875rem] px-4 w-full min-h-12 max-h-72 text-[#E8EAED]">
                <div ref={contentRefNew}>
                    {item.content && item.content}
                </div>
                {
                    (!item.content && item.listContent.length > 0) && result.map((v, i) => (
                        <List key={i} texts={v.label} isCheck={v.isCheck} />
                    ))
                }
            </div>}
            {item.labelName && <div className="labelDIv w-full h-9 flex items-center justify-start px-2">
                <div className="min-h-5 px-2 py-1 rounded-3xl w-auto centerItem text-[11px] text-[#E8EAED] border border-[rgb(95,99,104)]">
                    {item.labelName}
                </div>
            </div>}
            <div className={`${view ? `px-1` : `px-8`} pb-1 ${(item.content || item.listContent.length > 0) ? `` : `mt-1`} noteController flex items-center ${!item.isBin ? `justify-between` : `justify-start`} w-full h-[2.125rem] sticky bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                {!item.isBin ? (<><div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                    <MdOutlineImage />
                </div>
                    {item?.isArchive ? <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <BiArchiveOut />
                    </div> :
                        <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <BiArchiveIn />
                        </div>}
                    <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <MdOutlineCheckBox />
                    </div>
                    <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <MdOutlinePalette />
                    </div>
                    <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <HiOutlinePencil />
                    </div>
                    <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                        <RiDeleteBin6Line />
                    </div> </>) : (<>
                        <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <MdDeleteForever />
                        </div>
                        <div className="h-8 w-8 rounded-full centerItem hover:cursor-pointer hover:bg-[#e8eaed14] text-[1rem] hover:text-[#E8EAED] text-[#9AA0A6]">
                            <MdRestoreFromTrash />
                        </div> </>
                )}
            </div>
        </Link>
    );
};

export default ShowNote;
