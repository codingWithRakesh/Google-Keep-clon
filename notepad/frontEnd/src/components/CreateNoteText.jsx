import React, { useEffect, useRef, useState } from "react";
import { use } from "react";

const CreateNoteText = ({ pt,valueInString,addInList }) => {
  const [value, setValue] = valueInString;
  const [list, setList] = addInList;
  console.log("enter inside create note text")
  console.log("value",value)
  const [isCheck, setIsCheck] = useState(false)
  const divRef = useRef(null);
  
  useEffect(() => {
    const valueR = value.replace(/\n/g, "<div>").replace(/ /g, "&nbsp;");
    divRef.current.innerHTML = valueR;
  }, []);

  const handleInput = (e) => {
    const text = e.currentTarget.innerHTML
      .replace(/<div>/g, "\n")
      .replace(/<\/div>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&nbsp;/g, " ");
      console.log("nodeText",text)
    setValue(text.trim());

    setList((text + " ").split("\n"));
    console.log("list",list,"value",value)
    console.log("value1 ",value.split("\n"))

  };


  return (
    <>

    <div
      ref={divRef}
      contentEditable="true"
      className={`pl-4 pt-${pt || 0} normalText overflow-auto w-full h-full outline-none ${value === "" ? `placeholder` : ``}`}
      onInput={handleInput}
      suppressContentEditableWarning
      data-placeholder="Take a note..."
    />
    </>
  );
};

export default CreateNoteText;
