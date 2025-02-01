import React, { useRef, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import logo from "../assets/images/logo.png"
import { IoMdSearch } from 'react-icons/io'
import { RxCross2, RxDashboard } from 'react-icons/rx'
import { FaRegUser } from 'react-icons/fa'
import { BsViewList } from 'react-icons/bs'
import { IoReloadOutline } from 'react-icons/io5'
import { TbLayoutList } from "react-icons/tb";
import { useView } from '../contexts/View.context.jsx'
import { useProfile } from '../contexts/Profile.context.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useSidebar } from '../contexts/Sidebar.context.jsx'
import { useSearchNote } from '../contexts/FetchSearch.context.jsx'
import { useHideTool } from '../contexts/HideSearchTools.context.jsx'
import { API_URL } from '../constant/constants.js'


const Navbar = () => {
    const [view, setView] = useView()
    const [, setIsProfile] = useProfile()
    const navigate = useNavigate();
    const [crose, setCrose] = useState(false)
    const [isSidebar, setIsSidebar] = useSidebar()
    const inputRef = useRef(null)
    const [, setRerender] = useState(0)
    const [, setSearchNoteValue] = useSearchNote()
    const [searchV, setSearchV] = useState("")
    const [hide, setHide] = useHideTool()

    const fetchSearchData = async (e) => {
        const newSearchValue = e.target.value;
        if (e.target.value === "") {
            setHide(true)
            setSearchNoteValue(null)
        }
        if (newSearchValue === "") {
            setHide(true);
            setSearchNoteValue(null);
        } else {
            setHide(false);
        }
    
        setSearchV(newSearchValue);
    
        console.log("searchV : ", newSearchValue);

        try {
            const response = await fetch(`${API_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body : JSON.stringify({"searchValue" : newSearchValue})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            const data = await response.json();
            console.log(data.data[0].note)
            setSearchNoteValue(data.data[0].note);
        } catch (error) {
            console.log('Error fetching notes:', error.message);
            throw error
        }
    }

    return (
        <div className='h-14 bg-[rgb(32,33,36)] border-b-[.2px] border-[rgb(95,99,104)] text-white flex justify-between w-full z-20 items-center px-3 fixed top-0 right-0'>
            <div className="logo flex centerAlignJustify">
                <div onClick={() => setIsSidebar((v) => !v)} className='flex centerAlignJustify text-xl h-10 w-10 rounded-full hover:cursor-pointer hover:bg-[#e8eaed14]'>
                    <FiMenu />
                </div>
                <div className="logoImg h-9 w-9 flex centerAlignJustify ">
                    <img src={logo} className='h-full w-full object-cover' />
                </div>
                <p className='text-xl ml-2'>Peek</p>
            </div>
            <Link to="/search" className="searchBar">
                <div className="searchBox flex h-11 w-[45rem] rounded-lg items-center justify-between bg-[#F1F3F43D] px-3">
                    <div className="searchIcon h-9 w-9 rounded-full flex centerAlignJustify hover:cursor-pointer hover:bg-[#e8eaed14] text-xl">
                        <IoMdSearch />
                    </div>
                    <div onClick={() => {
                        setCrose(true)
                        if(!searchV){
                            setHide(true)
                        }
                    }} className="searchInput flex items-center h-11 w-[38rem]">
                        <input value={searchV} onChange={(e) => fetchSearchData(e)} ref={inputRef} type="text" placeholder='Search' className='w-full h-full bg-transparent bottom-0 outline-0 px-0 py-2' />
                    </div>
                    <div onClick={() => {
                        navigate(-1)
                        setCrose(false)
                        inputRef.current.value = ''
                        setHide(false)
                        setSearchV("")
                    }} className={`clearInput h-9 w-9 rounded-full flex centerAlignJustify hover:cursor-pointer ${crose ? `hover:bg-[#e8eaed14]` : ``} text-xl`}>
                        {crose && <RxCross2 />}
                    </div>
                </div>
            </Link>
            <div className="controllers flex gap-2 items-center">
                <div onClick={() => setRerender((v) => v + 1)} className="reload flex centerAlignJustify text-xl h-10 w-10 rounded-full hover:cursor-pointer hover:bg-[#e8eaed14] text-[#9AA0A6] hover:text-[#E8EAED]">
                    <IoReloadOutline />
                </div>
                <div onClick={() => setView((v) => !v)} className="listData flex centerAlignJustify text-xl h-10 w-10 rounded-full hover:cursor-pointer hover:bg-[#e8eaed14] hover:text-[#E8EAED] text-[#9AA0A6]">
                    {view ? <BsViewList /> : <RxDashboard />}
                </div>
                <div onClick={() => setIsProfile((value) => !value)} className="profile flex centerAlignJustify text-xl h-10 w-10 rounded-full hover:cursor-pointer hover:bg-[#e8eaed14] hover:text-[#E8EAED] text-[#9AA0A6]">
                    <FaRegUser />
                </div>
            </div>
        </div>
    )
}

export default Navbar