import React, { useEffect, useState } from 'react'
import { useView } from '../contexts/View.context'
import ShowNote from '../components/ShowNote'
import img from "../assets/images/img.jpg";
import { data } from '../components/temp.js'
import { useSidebar } from '../contexts/Sidebar.context.jsx';
import { API_URL } from '../constant/constants.js'

const Bin = () => {
  const [view] = useView()
  const [isSidebar] = useSidebar()
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_URL}/binnote`, {
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
        console.log('Fetched data: ', data.data[0].allNotes);
        setValue(data.data[0].allNotes);
      } catch (error) {
        console.error('Error fetching notes:', error.message);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className={`bg-[rgb(32,33,36)] pb-8 ${isSidebar ? `widthMainBig` : `widthMain`} heightConMin absolute right-0 top-14 flex flex-wrap content-start justify-center ${isSidebar ? `pl-28 pr-32` : `pl-7 pr-10`}`}>
      <div className="allContainer w-full min-h-screen mt-8">
        <div className={`showPinBox ${view ? `columns-4` : `flex flex-wrap justify-center content-start`} w-full min-h-0 gap-4`}>
          {
            value?.map((v, i) => (
              <ShowNote item={v} key={i} />
            ))
          }
          {/* <ShowNote content={data.fir} img={[img,img,img,img]} title="water"/>
            <ShowNote content={data.five} title="pay"/>
            <ShowNote content={data.four} img={[img]}/>
            <ShowNote title="helo"/>
            <ShowNote content={data.sec} img={[img,img]}/>
            <ShowNote content={data.six} title="shajh"/>
            <ShowNote/>
            <ShowNote content={data.ther} title="sjhj" img={[img,img,img]}/> */}
        </div>
      </div>
    </div>
  )
}

export default Bin