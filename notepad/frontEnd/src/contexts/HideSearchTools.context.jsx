import React, { createContext, useContext, useState } from 'react'

export const HideToolContext = createContext()

const HideToolContextProvider = ({ children }) => {
    const [hide, setHide] = useState(true)
    return (
        <HideToolContext.Provider value={[hide, setHide]}>
            {children}
        </HideToolContext.Provider>
    )
}
export default HideToolContextProvider

export function useHideTool() {
    return useContext(HideToolContext)
} 