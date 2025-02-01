import React, { createContext, useContext, useState } from 'react'

export const FetchLabelNoteContext = createContext()

const FetchLabelNoteContextProvider = ({ children }) => {
    const [labelNoteValue, setLabelNoteValue] = useState(null)
    return (
        <FetchLabelNoteContext.Provider value={[labelNoteValue, setLabelNoteValue]}>
            {children}
        </FetchLabelNoteContext.Provider>
    )
}
export default FetchLabelNoteContextProvider

export function useLabelNote() {
    return useContext(FetchLabelNoteContext)
} 