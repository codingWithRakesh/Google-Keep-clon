import React, { useEffect, useState } from 'react'
import { BiSolidImageAlt } from 'react-icons/bi'
import { IoLink, IoListSharp } from 'react-icons/io5'
import { MdLabel, MdList, MdOutlineLink } from 'react-icons/md'
import { RiListCheck } from 'react-icons/ri'
import { useSidebar } from '../contexts/Sidebar.context'
import { API_URL, API_NOTE } from '../constant/constants.js'
import { Link } from 'react-router-dom'
import { useView } from '../contexts/View.context.jsx'
import ShowNote from './ShowNote.jsx'

const SearchComponent = () => {
  const [isSidebar] = useSidebar()
  const [view] = useView()
  const [hide, setHide] = useState(true)
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_URL}/alllabels`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        console.log(data.data[0].allLabels)
        setValue(data.data[0].allLabels);
      } catch (error) {
        console.log('Error fetching notes:', error.message);
        throw error
      }
    };

    fetchNotes();
  }, []);

  const [searchValue, setSearchValue] = useState()
  const fetchList = async () => {
    setHide((v) => !v)
    try {
      const response = await fetch(`${API_NOTE}/searchlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      console.log(data.data)
      setSearchValue(data.data);
    } catch (error) {
      console.log('Error fetching notes:', error.message);
      throw error
    }
  }

  const fetchImage = async () => {
    setHide((v) => !v)
    try {
      const response = await fetch(`${API_NOTE}/searchimage`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      console.log(data.data)
      setSearchValue(data.data);
    } catch (error) {
      console.log('Error fetching notes:', error.message);
      throw error
    }
  }

  const fetchURL = async () => {
    setHide((v) => !v)
    try {
      const response = await fetch(`${API_NOTE}/searchurl`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      console.log("url ",data.data)
      setSearchValue(data.data);
    } catch (error) {
      console.log('Error fetching notes:', error.message);
      throw error
    }
  }
  return (
    <div className={`bg-[rgb(32,33,36)] pb-8 ${isSidebar ? `widthMainBig` : `widthMain`} heightConMin absolute right-0 top-14 flex flex-wrap content-start justify-center ${isSidebar ? `pl-28 pr-32` : `pl-7 pr-10`}`}>
      {hide && <> <div className="mt-8 flex flex-col bg-[#28292c]">
        <div className="h-9 w-full flex items-center justify-start px-2 text-sm text-[#E8EAED]">Types</div>
        <div className="w-full h-40 flex items-center justify-start">
          <div onClick={fetchList} className='relative border-2 border-[#28292c] h-[9.813rem] w-[9.813rem] bg-[rgb(138,180,248)] cursor-pointer centerItem text-4xl'>
            <MdList />
            <p className='text-[0.813rem] text-[#202124] w-full h-8 centerItem absolute left-0 bottom-2'>Lists</p>
          </div>
          <div onClick={fetchImage} className='relative border-2 border-[#28292c] h-[9.813rem] w-[9.813rem] bg-[rgb(138,180,248)] cursor-pointer centerItem text-4xl'>
            <BiSolidImageAlt />
            <p className='text-[0.813rem] text-[#202124] w-full h-8 centerItem absolute left-0 bottom-2'>Images</p>
          </div>
          <div onClick={fetchURL} className='relative border-2 border-[#28292c] h-[9.813rem] w-[9.813rem] bg-[rgb(138,180,248)] cursor-pointer centerItem text-4xl'>
            <MdOutlineLink />
            <p className='text-[0.813rem] text-[#202124] w-full h-8 centerItem absolute left-0 bottom-2'>URLs</p>
          </div>
        </div>
      </div>

        <div className="mt-4 min-h-7 flex flex-col bg-[#28292c] w-[29.5rem]">
          <div className="h-9 w-full flex items-center justify-start px-2 text-sm text-[#E8EAED]">Types</div>
          <div className="w-full min-h-40 flex  content-start justify-start flex-wrap">
            {
              value?.map((v, i) => (
                <Link to={`/label/${v.labelName}`} key={i} className='relative border-2 text-[#9AA0A6] border-[#28292c] h-[9.813rem] w-[9.813rem] bg-[rgb(60,64,67)] cursor-pointer centerItem text-4xl'>
                  <MdLabel />
                  <p className='text-[0.813rem] text-[#E8E1ED] w-full h-8 centerItem absolute left-0 bottom-2'>{v.labelName}</p>
                </Link>
              ))
            }

          </div>
        </div></>}

      {!hide && <div className={`showPinBox mt-4 ${view ? `columns-4` : `flex flex-wrap justify-center content-start`} w-full min-h-0 gap-4`}>
        {
          searchValue?.map((item, index) => (
            <ShowNote item={item} key={index} />
          ))
        }
      </div>}
    </div>
  )
}

export default SearchComponent