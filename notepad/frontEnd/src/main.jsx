import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ViewContextProvider from './contexts/View.context.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import MainContainer from './components/MainContainer.jsx'
import SearchComponent from './components/SearchComponent.jsx'
import BlurContainer from './components/BlurContainer.jsx'
import UpdateNote from './components/UpdateNote.jsx'
import CreateLabel from './pages/CreateLabel.jsx'
import Archive from './pages/Archive.jsx'
import Bin from './pages/Bin.jsx'
import Label from './pages/Label.jsx'
import ProfileContextProvider from './contexts/Profile.context.jsx'
import FullBlur from './components/FullBlur.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import SidebarContextProvider from './contexts/Sidebar.context.jsx'
import { ProtectRoute, AuthenticatedUserRoute } from './utils/user.check.jsx'
import LabelContextProvider from './contexts/EditLabel.context.jsx'
import FetchLabelContextProvider from './contexts/FetchLabel.context.jsx'
import FetchMainContextProvider from './contexts/FetchMainContainer.jsx'
import FetchLabelNoteContextProvider from './contexts/FetchLabelNote.context.jsx'
import FetchArchiveContextProvider from './contexts/FetchArchive.context.jsx'
import FetchBinContextProvider from './contexts/FetchBin.context.jsx'
import FetchSearchContextProvider from './contexts/FetchSearch.context.jsx'
import HideToolContextProvider from './contexts/HideSearchTools.context.jsx'

const noteShow = {
  path: "NOTE/:id",
  element: (
    <BlurContainer>
      <UpdateNote />
    </BlurContainer>
  ),
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <ProtectRoute>
              <MainContainer />
              <Outlet />
            </ProtectRoute>
          </>
        ),
        children: [noteShow],
      },
      {
        path: '/label/:label',
        element: (
          <>
            <Label />
            <Outlet />
          </>
        ),
        children: [noteShow],
      },
      {
        path: '/archive',
        element: (
          <>
            <Archive />
            <Outlet />
          </>
        ),
        children: [noteShow],
      },
      {
        path: '/trash',
        element: (
          <>
            <Bin />
            <Outlet />
          </>
        ),
        children: [noteShow],
      },
      {
        path: '/search',
        element: (
          <>
            <SearchComponent />
            <Outlet />
          </>
        ),
        children: [noteShow],
      },
      {
        path: '/login',
        element: (
          <FullBlur>
            <AuthenticatedUserRoute>
              <Login />
            </AuthenticatedUserRoute>
          </FullBlur>
        )
      },
      {
        path: '/singup',
        element: (
          <FullBlur>
            <AuthenticatedUserRoute>
              <Signup />
            </AuthenticatedUserRoute>
          </FullBlur>
        )
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HideToolContextProvider>
      <FetchSearchContextProvider>
        <FetchBinContextProvider>
          <FetchArchiveContextProvider>
            <FetchLabelNoteContextProvider>
              <FetchMainContextProvider>
                <FetchLabelContextProvider>
                  <LabelContextProvider>
                    <SidebarContextProvider>
                      <ProfileContextProvider>
                        <ViewContextProvider>
                          <RouterProvider router={router} />
                        </ViewContextProvider>
                      </ProfileContextProvider>
                    </SidebarContextProvider>
                  </LabelContextProvider>
                </FetchLabelContextProvider>
              </FetchMainContextProvider>
            </FetchLabelNoteContextProvider>
          </FetchArchiveContextProvider>
        </FetchBinContextProvider>
      </FetchSearchContextProvider>
    </HideToolContextProvider>
  </StrictMode>
)