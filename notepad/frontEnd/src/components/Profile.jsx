import React from 'react'
import img from "../assets/images/img.jpg";
import cover from "../assets/images/cover.jpg";
import { MdLogout, MdOutlineDone } from 'react-icons/md';
import { FaCircleUser, FaUser } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { useProfile } from '../contexts/Profile.context';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Profile = () => {
    const [, setIsProfile] = useProfile()
    const { isLoading, isCheckingAuth, user,logout } = useAuthStore()
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    // console.log("logout",user)
    // console.log(isCheckingAuth)
    const navigate = useNavigate()

    const logOut = async() => {
        setIsProfile((value) => !value)
        await logout()
        navigate('/login')
    }
    if (isCheckingAuth) {
        return <div>Loading...</div>
    }
    return (
        <div className='fixed top-14 gap-4 rounded-2xl text-[#E8EAED] z-30 flex flex-col justify-center content-start right-4 w-[20rem] h-[17rem] bg-[#2C3333] centerItem'>
            <div onClick={() => setIsProfile((value) => !value)} className='absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-[#e8eaed14] hover:cursor-pointer centerItem'>
                <RxCross2 />
            </div>
            <div className="logo h-14 w-14 text-[3rem] overflow-hidden centerItem">
                <FaUser />
            </div>
            <div className="gmail text-sm">
                {user.email}
            </div>
            <div className="name text-xl">
                Hi,{user.fullName} {cookies.myCookieName || 'Not Found'}
            </div>
            <button onClick={logOut} className='h-12 flex centerItem gap-2 min-w-16 hover:bg-[#1E201E] bg-[#181C14] rounded-xl px-4'>
                <div>
                    <MdLogout />
                </div>
                Logout
            </button>
        </div>
    )
}

export default Profile