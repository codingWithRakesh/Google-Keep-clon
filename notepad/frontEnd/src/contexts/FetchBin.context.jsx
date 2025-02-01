import React, { createContext, useContext, useState } from 'react'

export const FetchBinContext = createContext()

const FetchBinContextProvider = ({ children }) => {
    const [binNote, setBinNote] = useState(null)
    return (
        <FetchBinContext.Provider value={[binNote, setBinNote]}>
            {children}
        </FetchBinContext.Provider>
    )
}
export default FetchBinContextProvider

export function useBin() {
    return useContext(FetchBinContext)
} 