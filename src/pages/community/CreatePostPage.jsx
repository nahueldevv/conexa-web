import React from "react"
import { useNavigate } from "react-router-dom"
import CreatePostForm from "./CreatePostForm" 

const CreatePostPage = () => {
    const navigate = useNavigate()

    return (
        <main className="min-h-screen bg-white dark:bg-[#0A0A0A] font-display flex flex-col items-center py-12">
            <div className="max-w-xl w-full px-4 md:px-0 mx-auto">

                {/* FORMULARIO */}
                <CreatePostForm
                    forums={[]} 
                    activeForumId={1}
                    onSuccess={() => navigate("/community")}
                />

            </div>
        </main>
    )
}

export default CreatePostPage
