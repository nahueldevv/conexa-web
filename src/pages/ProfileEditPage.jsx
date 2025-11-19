import ProfileForm from "../components/profile/ProfileForm"

function ProfileEditPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center px-4">
      <div className="w-full max-w-xl bg-neutral-100 dark:bg-neutral-900 p-6 rounded-xl shadow-md animate-fadeIn">

        <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
          Perfil del Usuario
        </h1>

        <ProfileForm />

      </div>
    </div>
  )
}

export default ProfileEditPage