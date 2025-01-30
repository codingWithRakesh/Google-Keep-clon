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
        children: [
          {
            path: "note/:id",
            element: (
              <BlurContainer>
                <UpdateNote />
              </BlurContainer>
            ),
          }
        ],
      },
      {
        path: '/label/:label',
        element: <Label />,
      },
      {
        path: '/archive',
        element: <Archive />
      },
      {
        path: '/trash',
        element: <Bin />
      },
      {
        path: '/search',
        element: <SearchComponent />
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
    <LabelContextProvider>
      <SidebarContextProvider>
        <ProfileContextProvider>
          <ViewContextProvider>
            <RouterProvider router={router} />
          </ViewContextProvider>
        </ProfileContextProvider>
      </SidebarContextProvider>
    </LabelContextProvider>
  </StrictMode>
)
