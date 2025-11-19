import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [successData, setSuccessData] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      enterpriseName: user?.enterpriseName || "",
      contactPerson: user?.contactPerson || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      country: user?.country || "",
      description: user?.description || "",
      profileImageUrl: user?.profileImageUrl || "",
      operationalRegions: user?.operationalRegions || "",
      fleetSize: user?.fleetSize || ""
    }
  })

  const onSubmit = async (data) => {
    const editableFields = [
      "enterpriseName",
      "contactPerson",
      "phone",
      "address",
      "city",
      "country",
      "description",
      "operationalRegions",
      "fleetSize",
      "profileImageUrl"
    ]

    const payload = {}
    editableFields.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
    payload[key] = data[key]
    }
    })

    try {
    const response = await updateProfile(payload)

    // Save the message and the updated profile to display it in the component.
    setSuccessData({
    message: response?.message || "Perfil actualizado correctamente.",
    profile: response?.profile || {}
    })


    // Redirect after viewing the message
    setTimeout(() => navigate("/"), 1200)

    } catch (error) {
    const serverMsg = error?.response?.data?.message || error?.message
    setErrorMessage(serverMsg || "No se pudo actualizar el perfil.")
    }
    }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        space-y-6 p-6 rounded-xl border shadow-sm
        bg-white border-neutral-200
        dark:bg-neutral-900 dark:border-neutral-700
      "
    >

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Editar Perfil
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Actualiza la Información de tu Perfil aquí.
        </p>
      </div>

      {/* READ ONLY FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            Email (solo lectura)
          </span>
          <input
            disabled
            value={user?.email || ""}
            className="
              px-4 py-2 rounded-lg
              bg-neutral-200 dark:bg-neutral-800
              text-neutral-800 dark:text-neutral-300
              border border-neutral-300 dark:border-neutral-700
            "
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            Rol (solo lectura)
          </span>
          <input
            disabled
            value={user?.rol || user?.role || ""}
            className="
              px-4 py-2 rounded-lg
              bg-neutral-200 dark:bg-neutral-800
              text-neutral-800 dark:text-neutral-300
              border border-neutral-300 dark:border-neutral-700
            "
          />
        </label>
      </div>

      {/* EDITABLE */}
      {/* Enterprise Name / Contact Person */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            Nombre de la Empresa <span className="text-red-500">*</span>
          </span>
          <input
            {...register("enterpriseName", { required: "El Nombre de la Empresa es obligatorio",
              minLength: { value: 2, message: "Debe tener al menos 2 caracteres" }
            })}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="Company / Enterprise name"
          />
          {errors.enterpriseName && (
            <p className="text-red-500 text-sm mt-1">{errors.enterpriseName.message}</p>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            Persona de Contacto <span className="text-red-500">*</span>
          </span>
          <input
            {...register("contactPerson", {
              required: "La Persona de Contacto es obligatoria",
              minLength: { value: 4, message: "Debe tener al menos 4 caracteres" }
            })}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="Nombres Apellido"
          />
          {errors.contactPerson && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
          )}
        </label>
      </div>

      {/* Phone / Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">Teléfono</span>
          <input
            {...register("phone", {
              pattern: {
                value: /^[0-9+\-() ]+$/,
                message: "Formato de Teléfono Inválido"
              }
            })}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">Dirección</span>
          <input
            {...register("address")}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="Calle Falsa 123"
          />
        </label>
      </div>

      {/* City / Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            Ciudad <span className="text-red-500">*</span>
          </span>
          <input
            {...register("city", { required: "La Ciudad es obligatoria"})}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="Yala"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            País <span className="text-red-500">*</span> 
          </span>
          <input
            {...register("country", { required: "El País es obligatorio"})}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="País"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
        </label>
      </div>

      {/* Profile Image / Description */}
      <div className="grid grid-cols-1 gap-4">

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">URL de la Imágen de Perfil</span>
          <input
            {...register("profileImageUrl", {
              pattern: { value: /^https?:\/\/.+/i, message: "La URL debe ser una dirección válida a la Imágen" }
            })}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="https://example.com/image.png"
          />
          {errors.profileImageUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.profileImageUrl.message}</p>
          )}
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">Descripción</span>
          <textarea
            {...register("description", { maxLength: 1000 })}
            rows={5}
            className="
              px-4 py-3 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="Escribe una descripción con información útil..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">La Longitud Máxima Permitida es de 1000 caracteres</p>
          )}
        </label>
      </div>

      {/* Operational regions / fleet size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">Regiones Operativas</span>
          <input
            {...register("operationalRegions")}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            placeholder="NOA, Centro"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm mb-1 text-neutral-700 dark:text-neutral-300">Tamaño de Flota</span>
          <input
            type="number"
            {...register("fleetSize", { valueAsNumber: true })}
            className="
              px-4 py-2 rounded-lg bg-transparent
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-200
              placeholder-neutral-400
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition
            "
            min={0}
            placeholder="Number of vehicles"
          />
        </label>
      </div>

      {/* Submit + Cancel */}
      <div className="flex items-center justify-end gap-3">

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="
            px-4 py-2 rounded-lg
            bg-neutral-200 dark:bg-neutral-800
            text-neutral-700 dark:text-neutral-200
            border border-neutral-300 dark:border-neutral-700
            transition-all
            hover:bg-neutral-300 dark:hover:bg-neutral-700
          "
        >
          Cancel
        </button>

        {successData && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg text-sm mb-4">
            {successData.message}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm mb-4">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            px-6 h-12 rounded-lg 
            bg-indigo-600 text-white 
            hover:bg-indigo-700 
            disabled:opacity-50
            text-sm font-bold tracking-[0.015em]
            transition-all shadow-sm
          "
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}

export default ProfileForm