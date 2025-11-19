import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.jsx"

import HomePage from "./pages/HomePage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import CommunityPage from "./pages/community/CommunityPage.jsx"
import AboutPage from "./pages/AboutPage.jsx"

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"

import DashboardPage from "./pages/market/DashboardPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import ProfileEditPage from "./pages/ProfileEditPage.jsx"
import CreateOfferPage from "./pages/market/CreateOfferPage.jsx"
import CreateRequestPage from "./pages/market/CreateRequestPage.jsx"
import MyPublicationsPage from "./pages/market/MyPublicationsPage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/about", element: <AboutPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/mercado", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/profile/edit", element: <ProfileEditPage /> },
          { path: "/mercado/create-offer", element: <CreateOfferPage /> },
          { path: "/mercado/create-request", element: <CreateRequestPage /> },
          { path: "/mercado/my-publications", element: <MyPublicationsPage /> }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)