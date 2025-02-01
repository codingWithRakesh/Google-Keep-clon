import React, { useEffect, useState } from 'react'
import { BsLightbulb } from 'react-icons/bs'
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiArchiveIn } from "react-icons/bi";
import { HiOutlinePencil } from "react-icons/hi2";
import { MdLabelOutline, MdOutlineLightbulb } from "react-icons/md";
import NoteLi from './NoteLi';
import { useSidebar } from '../contexts/Sidebar.context';
import { useFetchLabel } from '../contexts/FetchLabel.context.jsx';

const Sidebar = () => {
  const [isSidebar] = useSidebar()
  const [valueLabel] = useFetchLabel()

  let listNew = valueLabel && valueLabel?.map((data) => {
    return {
      icon: <MdLabelOutline />,
      text : data.labelName,
      herf : `/label/${data.labelName}`,
      isLink : true
    }
  })
  listNew = listNew || []

  const lis = [
    {
      icon: <MdOutlineLightbulb />,
      text: "Notes",
      herf: "/",
      isLink : true
    },
    ...listNew,
    {
      icon: <HiOutlinePencil />,
      text: "Edit labels",
      herf: "/labels",
      isLink : false
    },
    {
      icon: <BiArchiveIn />,
      text: "Archive",
      herf: "/archive",
      isLink : true
    },
    {
      icon: <RiDeleteBin6Line />,
      text: "Bin",
      herf: "/trash",
      isLink : true
    }
  ]
  return (
    <div className={`bg-[rgb(32,33,36)] ${isSidebar ? `w-20` : `w-64`} heightCon fixed left-0 top-14 text-[#9AA0A6] pt-2 text-sm`}>
      {
        lis.map((data, index) => (
          <NoteLi key={index} icon={data.icon} text={isSidebar ? "" : data.text} herf={data.herf} LinkCheck={data.isLink} />
        ))
      }
    </div>
  )
}

export default Sidebar