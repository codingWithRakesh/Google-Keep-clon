import React, { createContext, useContext, useState } from 'react'

export const FetchSearchContext = createContext()

const FetchSearchContextProvider = ({ children }) => {
    const [searchNoteValue, setSearchNoteValue] = useState(null)
    return (
        <FetchSearchContext.Provider value={[searchNoteValue, setSearchNoteValue]}>
            {children}
        </FetchSearchContext.Provider>
    )
}
export default FetchSearchContextProvider

export function useSearchNote() {
    return useContext(FetchSearchContext)
} 