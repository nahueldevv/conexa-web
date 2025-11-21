import React from "react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

function ProfilePage() {
  const { user } = useAuth()
  const { deleteAccount } = useAuth()
  const navigate = useNavigate()
  console.log(user)
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente."
    )

    if (!confirmed) return

    try {
      await deleteAccount()
      localStorage.setItem("accountDeleted", "true")
      navigate("/login")      
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("Ocurrió un error al eliminar la cuenta.")
    }
  }

  return (
    <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5 mt-16 
      bg-background-light dark:bg-background-dark 
      font-display min-h-screen text-gray-900 dark:text-gray-100">

      <div className="layout-content-container flex flex-col max-w-4xl flex-1 w-full gap-8">

        {/* Header */}
        <div className="flex flex-wrap justify-between gap-4 py-4 border-b 
          border-gray-200 dark:border-white/10">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-black leading-tight tracking-[-0.033em]">
              Perfil del Usuario
            </p>
            <p className="text-base font-normal text-gray-500 dark:text-gray-300">
              Administra tu cuenta y demás detalles
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex p-4 bg-white dark:bg-black/20 rounded-xl 
          border border-gray-200 dark:border-white/10 backdrop-blur-sm">
          
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex gap-6 items-center">

              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 ring-2 ring-gray-200 dark:ring-white/10"
                style={{
                  backgroundImage: `url("${user?.profileImageUrl?.trim()
                    ? user.profileImageUrl
                    : "https://placehold.co/200x200"}")`,
                }}
              />

              <div className="flex flex-col justify-center gap-1">
                <p className="text-2xl font-bold">
                  {user?.name || user?.contactPerson || "User Name"}
                </p>

                <p className="text-sm font-medium text-amber-700 bg-amber-100 
                  dark:text-amber-300 dark:bg-amber-900/40 
                  py-1 px-3 rounded-full self-start">
                  {user?.rol || "Transportista"}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="flex flex-col gap-8 bg-white dark:bg-black/20 p-6 rounded-xl 
          border border-gray-200 dark:border-white/10 backdrop-blur-sm">

          {/* Account Information */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold pb-2 border-b 
              border-gray-200 dark:border-white/10">
              Información de la Cuenta
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col">
                <p className="text-sm font-medium pb-2">Email</p>
                <input
                  className="form-input h-12 p-3 rounded-lg bg-gray-100 dark:bg-white/5
                  text-gray-900 dark:text-gray-100 border-none focus:ring-0"
                  disabled
                  value={user?.email || ""}
                />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium pb-2">Fecha de Creación de la Cuenta</p>
                <input
                  className="form-input h-12 p-3 rounded-lg bg-gray-100 dark:bg-white/5
                  text-gray-900 dark:text-gray-100 border-none focus:ring-0"
                  disabled
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : ""
                  }
                />
              </div>

            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold pb-2 border-b 
              border-gray-200 dark:border-white/10">
              Datos de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {[
                ["Persona de Contacto", "contactPerson"],
                ["Teléfono", "phone"],
                ["Dirección", "address"],
                ["Ciudad", "city"],
                ["País", "country"],
              ].map(([label, key]) => (
                <label key={key} className="flex flex-col">
                  <p className="text-sm font-medium pb-2">{label}</p>
                  <input
                    className="form-input h-12 p-3 rounded-lg bg-transparent 
                    border border-gray-300 dark:border-white/20 
                    text-gray-900 dark:text-gray-100 
                    placeholder:text-gray-400
                    focus:ring-2 focus:ring-indigo-500"
                    disabled
                    value={user?.[key] || ""}
                  />
                </label>
              ))}

            </div>
          </div>

          {/* Public Profile */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold pb-2 border-b 
              border-gray-200 dark:border-white/10">
              Perfil Público
            </h3>

            <label className="flex flex-col w-full">
              <p className="text-sm font-medium pb-2">Descripción</p>
              <textarea
                className="min-h-32 p-3 rounded-lg bg-transparent 
                border border-gray-300 dark:border-white/20 
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400
                focus:ring-2 focus:ring-indigo-500"
                disabled
                value={user?.description || ""}
              />
            </label>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 
          p-6 bg-white dark:bg-black/20 rounded-xl 
          border border-gray-200 dark:border-white/10 backdrop-blur-sm">

          <button
            onClick={handleDeleteAccount}
            className="flex w-full sm:w-auto items-center justify-center h-12 px-6 
            rounded-lg bg-gray-100 dark:bg-white/10 
            w-full sm:w-auto text-red-600 dark:text-red-400 
            hover:bg-gray-200 dark:hover:bg-white/20 
            text-sm font-bold tracking-[0.015em]"
          >
            Eliminar Cuenta
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

            <Link
              to="/"
              className="flex w-full sm:w-auto items-center justify-center h-12 px-6 
                rounded-lg bg-gray-100 dark:bg-white/10 
                text-gray-900 dark:text-gray-100 
                hover:bg-gray-200 dark:hover:bg-white/20 
                text-sm font-bold tracking-[0.015em]"
            >
              Volver al Inicio
            </Link>

            <Link
              to="/profile/edit"
              className="flex w-full sm:w-auto items-center justify-center h-12 px-6 
                rounded-lg bg-indigo-600 text-white 
                hover:bg-indigo-700 text-sm font-bold tracking-[0.015em]"
            >
              Editar Perfil
            </Link>

          </div>

        </div>

      </div>
    </main>
  )
}

export default ProfilePage