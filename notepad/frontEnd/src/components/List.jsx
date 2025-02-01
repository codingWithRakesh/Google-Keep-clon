import React from 'react'
import { MdCheckBox, MdOutlineCheckBoxOutlineBlank } from 'react-icons/md'

const List = ({isCheck,texts}) => {
  console.log("isCheck ",isCheck," texts ", texts)
  return (
    <div className="listsB flex relative items-start justify-between w-full min-h-8">
      <div className="text-[#9AA0A6] centerItem h-6 w-6 mr-2 text-[1.2rem] sticky top-0 left-0">
        {!isCheck ? <MdOutlineCheckBoxOutlineBlank /> : <MdCheckBox />}
      </div>
      <p className={`flex-1 sticky w-full min-h-8 top-0 right-0 truncate-text ${isCheck ? `line-through` : ``}`}>
        {texts}
      </p>
    </div>
  )
}

export default List