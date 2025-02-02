import React, { useEffect, useRef, useState } from 'react'
import CreateNote from './CreateNote';
import ShowNote from './ShowNote';
import img from "../assets/images/img.jpg";
import cover from "../assets/images/cover.jpg";
import { useView } from '../contexts/View.context.jsx';
import { useSidebar } from '../contexts/Sidebar.context.jsx';
import { API_URL } from '../constant/constants.js'
import { useFetchLabel } from '../contexts/FetchLabel.context.jsx';
import fetchNOtes from '../utils/FetchLabels.jsx';
import fetchMainContainerNotes from '../utils/FetchMainContainer.jsx';
import { useMainContainer } from '../contexts/FetchMainContainer.jsx';
import { Outlet } from 'react-router-dom';

const MainContainer = () => {
  const [, setValueLabel] = useFetchLabel()
  const [view] = useView()
  const [isSidebar] = useSidebar()
  const [valueMain, setValueMain] = useMainContainer()

  useEffect(() => {
    fetchNOtes(setValueLabel);
    fetchMainContainerNotes(setValueMain)
  }, []);

  // console.log("valueMain ",valueMain)
  const pinnedData = valueMain && valueMain?.filter((item) => item.isPin);
  const notPinnedData = valueMain && valueMain?.filter((item) => !item.isPin);


  return (
    <>
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

        {notPinnedData?.length > 0 && <div className={`nonpinContainer w-full ${!pinnedData?.length > 0 ? `` : `mt-10`} min-h-0 flex flex-wrap content-start justify-center`}>
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
    </>
  )
}

export default MainContainer