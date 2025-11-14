import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Loading...
        </h1>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute