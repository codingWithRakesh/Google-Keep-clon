import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSidebar } from '../contexts/Sidebar.context'
import { useLabel } from '../contexts/EditLabel.context'

const NoteLi = ({icon,text,herf,LinkCheck}) => {
    const [isSidebar, setIsSidebar] = useSidebar()
    const [isLabel, setIsLabel] = useLabel()
    return (
        LinkCheck ? 
        <NavLink to={herf} className={`items flex items-center ${isSidebar ? `w-full` : `w-64`} h-11 rounded-r-full pl-6 hover:cursor-pointer hover:bg-[#e8eaed14]`}>
            <div className={`iconItem mr-8 text-[1.3rem] rounded-full centerItem`}>
            {icon}
            </div>
            <p className='text-white'>{text}</p>
        </NavLink>
        :
        <div onClick={()=>setIsLabel((v) => !v)} className={`items flex items-center ${isSidebar ? `w-full` : `w-64`} h-11 rounded-r-full pl-6 hover:cursor-pointer hover:bg-[#e8eaed14]`}>
            <div className={`iconItem mr-8 text-[1.3rem] rounded-full centerItem`}>
            {icon}
            </div>
            <p className='text-white'>{text}</p>
        </div>
    )
}

export default NoteLi