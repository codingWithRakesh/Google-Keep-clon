import React, { createContext, useContext, useState } from 'react'

export const FetchArchiveContext = createContext()

const FetchArchiveContextProvider = ({ children }) => {
    const [archiveNote, setArchiveNote] = useState(null)
    return (
        <FetchArchiveContext.Provider value={[archiveNote, setArchiveNote]}>
            {children}
        </FetchArchiveContext.Provider>
    )
}
export default FetchArchiveContextProvider

export function useArchive() {
    return useContext(FetchArchiveContext)
} 