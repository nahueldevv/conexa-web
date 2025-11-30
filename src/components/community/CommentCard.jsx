import React, { useState } from "react"
import { ThumbsUp, Pencil, Trash2, X, MessageSquare, CornerDownRight } from "lucide-react"

const getInitials = (name = "") => {
  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase()
}

const CommentCard = ({
  comment,
  user,
  updateLocalComment,
  removeLocalComment,
  isReply = false // Prop para indentar si es respuesta (futuro)
}) => {
  const isOwner = user && user.id === comment.user_id

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.content)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const avatarUrl = comment.avatar_url ?? null
  const displayName = comment.userName || "Usuario"

  const handleEdit = () => {
    updateLocalComment(comment.id, text)
    comment._edited = true
    setEditing(false)
  }

  const handleDelete = () => {
    setDeleteOpen(false)
    removeLocalComment(comment.id)
  }

  // Clases dinámicas para indentación (Estilo Stitch)
  const wrapperClasses = isReply 
    ? "ml-8 sm:ml-12 border-l-2 border-white/10 pl-4" 
    : ""

  return (
    <div className={`flex gap-4 group animate-fadeIn ${wrapperClasses}`}>
      
      {/* Avatar Column */}
      <div className="shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border border-white/10">
            {getInitials(displayName)}
          </div>
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0 bg-white/5 dark:bg-[#1E293B]/40 rounded-xl p-4 border border-gray-200 dark:border-white/5 hover:border-white/10 transition-colors">
        
        {/* Header: Name + Time + Actions */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {displayName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              • {new Date(comment.created_at).toLocaleString()}
            </span>
            {comment._edited && (
              <span className="text-[10px] text-gray-400 italic">(editado)</span>
            )}
          </div>

          {/* Action Buttons (Solo visibles para dueño) */}
          {!editing && isOwner && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Editar"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Body Text */}
        {!editing ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap wrap-break-words">
            {comment.content}
          </p>
        ) : (
          <div className="space-y-3 mt-2 animate-fadeIn">
            <textarea
              rows={3}
              className="w-full p-3 rounded-lg bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions (Like/Reply) - Visual Only for now */}
        {!editing && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-white/5">
            <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors">
              <ThumbsUp size={14} />
              <span>Me gusta</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-400 transition-colors">
              <CornerDownRight size={14} />
              <span>Responder</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 transform scale-100 transition-all">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">¿Eliminar comentario?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-lg shadow-red-500/20 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentCard