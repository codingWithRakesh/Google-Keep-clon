import React, { createContext, useContext, useState } from 'react'

export const ViewContext = createContext()

const ViewContextProvider = ({ children }) => {
    const [view, setView] = useState(true)
    return (
        <ViewContext.Provider value={[view, setView]}>
            {children}
        </ViewContext.Provider>
    )
}
export default ViewContextProvider

export function useView() {
    return useContext(ViewContext)
} 