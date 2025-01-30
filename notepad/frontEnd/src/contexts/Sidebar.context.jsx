import React, { createContext, useContext, useState } from 'react'

export const SidebarContext = createContext()

const SidebarContextProvider = ({ children }) => {
    const [isSidebar, setIsSidebar] = useState(false)
    return (
        <SidebarContext.Provider value={[isSidebar, setIsSidebar]}>
            {children}
        </SidebarContext.Provider>
    )
}
export default SidebarContextProvider

export function useSidebar() {
    return useContext(SidebarContext)
} 