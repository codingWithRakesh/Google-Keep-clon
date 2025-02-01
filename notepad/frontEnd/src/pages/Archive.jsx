import React, { useEffect, useState } from 'react'
import { useView } from '../contexts/View.context'
import ShowNote from '../components/ShowNote'
import img from "../assets/images/img.jpg";
import { useSidebar } from '../contexts/Sidebar.context.jsx';
import { API_URL } from '../constant/constants.js'
import { useArchive } from '../contexts/FetchArchive.context.jsx';
import fetchArchiveNotes from '../utils/FetchArchive.jsx';

const Archive = () => {
  const [view] = useView()
  const [isSidebar] = useSidebar()
  const [archiveNote, setArchiveNote] = useArchive()
  
  useEffect(() => {
    fetchArchiveNotes(setArchiveNote)
  }, []);

  console.log("archiveNote", archiveNote)
  
  return (
    <div className={`bg-[rgb(32,33,36)] pb-8 ${isSidebar ? `widthMainBig` : `widthMain`} heightConMin absolute right-0 top-14 flex flex-wrap content-start justify-center ${isSidebar ? `pl-28 pr-32` : `pl-7 pr-10`}`}>
      <div className="allContainer w-full min-h-screen mt-8">
        <div className={`showPinBox ${view ? `columns-4` : `flex flex-wrap justify-center content-start`} w-full min-h-0 gap-4`}>
          {
            archiveNote?.map((v,i) => (
              <ShowNote item={v} key={i}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Archive