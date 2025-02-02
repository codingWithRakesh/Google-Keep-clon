import React, { useEffect, useState } from 'react'
import { useView } from '../contexts/View.context.jsx'
import ShowNote from '../components/ShowNote.jsx'
import img from "../assets/images/img.jpg";
import { useSidebar } from '../contexts/Sidebar.context.jsx';
import { useParams } from 'react-router-dom';
import { API_URL } from '../constant/constants.js'
import CreateNote from '../components/CreateNote.jsx';
import { useLabelNote } from '../contexts/FetchLabelNote.context.jsx';
import fetchLabelsNotes from '../utils/FetchLabelsNote.jsx';

const Label = () => {
  const [view] = useView()
  const [isSidebar] = useSidebar()
  const paramsdata = useParams();
  // console.log(paramsdata.label)

  const [labelNoteValue, setLabelNoteValue] = useLabelNote()

  useEffect(() => {
    fetchLabelsNotes(setLabelNoteValue, paramsdata.label)
  }, [paramsdata.label]);

  // useEffect(() => {
  //   fetchLabelsNotes(setLabelNoteValue, paramsdata.label)
  // }, [])
  
  
  // console.log("setLabelNoteValue ", labelNoteValue)

  const pinnedData = labelNoteValue?.filter((item) => item.isPin);
  const notPinnedData = labelNoteValue?.filter((item) => !item.isPin);
  // console.log("notPinnedData ", notPinnedData?.length < 0)
  return (
    <div className={`bg-[rgb(32,33,36)] pb-8 ${isSidebar ? `widthMainBig` : `widthMain`} heightConMin absolute right-0 top-14 flex flex-wrap content-start justify-center ${isSidebar ? `pl-28 pr-32` : `pl-7 pr-10`}`}>

      <CreateNote />

      <div className="allContainer w-full min-h-screen mt-8">
        {pinnedData?.length > 0 && <div className="pinContainer w-full min-h-0 flex flex-wrap content-start justify-center">
          <div className={`titlePin ${view ? `w-full` : `w-[60%]`} h-8 flex justify-start items-center px-4 text-[.688rem] text-[#9AA0A6]`}>PINNED</div>
          <div className={`showPinBox ${view ? `columns-4` : `flex flex-wrap justify-center content-start`} w-full min-h-0 gap-4`}>
            {
              pinnedData?.map((item, index) => (
                <ShowNote key={index} item={item} />
              ))
            }
          </div>
        </div>}

        {notPinnedData?.length > 0 && <div className={`notpinContainer w-full ${pinnedData?.length > 0 ? `mt-10` : ``} min-h-0 flex flex-wrap content-start justify-center`}>
          <div className={`titlePin ${view ? `w-full` : `w-[60%]`} h-8 flex justify-start items-center px-4 text-[.688rem] text-[#9AA0A6]`}>OTHERS</div>
          <div className={`showPinBox ${view ? ` columns-4` : `flex flex-wrap justify-center content-start`} w-full min-h-0 gap-4`}>
            {
              notPinnedData?.map((item, index) => (
                <ShowNote key={index} item={item} />
              ))
            }
          </div>
        </div>}
      </div>
    </div>
  )
}

export default Label