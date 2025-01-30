import React from 'react'

const BlurContainer = ({children}) => {
  return (
    <div className='w-full h-screen bg-[#0A0A0A99] fixed top-0 left-0 z-40 centerItem'>
        {children}
    </div>
  )
}

export default BlurContainer