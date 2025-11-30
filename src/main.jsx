// main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.jsx"
import { ChatProvider } from "./context/ChatContext.jsx"

import HomePage from "./pages/HomePage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import CommunityPage from "./pages/community/CommunityPage.jsx"
// 🚨 Importación CRÍTICA
import CreatePostPage from "./pages/community/CreatePostPage.jsx" 
import SettingsPage from "./pages/SettingsPage.jsx"

import InboxPage from "./pages/messages/InboxPage.jsx"

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"

import DashboardPage from "./pages/market/DashboardPage.jsx"
import MyPublicationsPage from "./pages/market/MyPublicationsPage.jsx"
import CreatePublicationPage from "./pages/market/CreatePublicationPage.jsx"
import PostDetailPage from "./pages/community/PostDetailPage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // Opcional: Esto captura el error de componente que estabas viendo
    errorElement: <div>¡Oops! Un error inesperado. Por favor, vuelve a la página anterior.</div>,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/community", element: <CommunityPage /> },
      // 🛑 CORRECCIÓN CRÍTICA: La ruta que faltaba
      { path: "/community/create", element: <CreatePostPage /> }, 
      { path: "/community/post/:id", element: <PostDetailPage/>},
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/marketplace", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/messages", element: <InboxPage /> },
          { path: "/marketplace/create", element: <CreatePublicationPage /> },
          { path: "/marketplace/my-publications", element: <MyPublicationsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  </React.StrictMode>
)