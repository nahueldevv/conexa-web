import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Flag,
  ThumbsUp,
  MessageSquare,
  Send,
  Bookmark,
  Bold,
  Italic,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { usePostThread } from "../../hooks/usePostThread";
import { deletePost } from "../../services/community.service";
import CommentCard from "../../components/community/CommentCard";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";

// Helper para iniciales
const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "?"
  );
};

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    post,
    comments,
    loading,
    error,
    user,
    submitComment,
    removeLocalComment,
    updateLocalComment,
    updatePostContent,
  } = usePostThread(id);

  const [newComment, setNewComment] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editPostData, setEditPostData] = useState({ title: "", content: "" });
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (!post || error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Post no encontrado
          </h2>
          <button
            onClick={() => navigate("/community")}
            className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
          >
            Volver a la Comunidad
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === post.userId;
  const displayName =
    post.author_name || post.userName || post.user_name || "Usuario";
  const avatarUrl =
    post.author_avatar || post.user_avatar || post.avatar_url || null;

  // --- HANDLERS ---
  const handleStartEditPost = () => {
    setEditingPost(true);
    setEditPostData({
      title: post.title || "",
      content: post.content || "",
    });
  };

  const handleSavePostEdit = async () => {
    await updatePostContent(editPostData);
    setEditingPost(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await submitComment(newComment);
    setNewComment("");
  };

  const handleDeletePost = async () => {
    if (!isOwner) return;
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      navigate("/community");
    } catch (err) {
      console.error("Error eliminando el post:", err);
      setIsDeleting(false);
    } finally {
      setDeletePostOpen(false);
    }
  };

  // --- CLASES REUTILIZABLES (Estilo Stitch/Dark) ---
  // Botones superiores translúcidos
  const toolBtnClass =
    "flex items-center gap-2 rounded-lg bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white/10";
  // Icon buttons (edit/delete/flags)
  const iconBtnClass =
    "text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1";

  return (
    <>
      {!isAuthenticated && <Navbar />}

      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display transition-colors pb-20">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
          {/* 1. BREADCRUMBS */}
          <nav className="flex flex-wrap items-center gap-2 px-1 py-2 text-sm">
            <span
              className="text-gray-500 dark:text-gray-400 hover:text-amber-500 cursor-pointer transition-colors"
              onClick={() => navigate("/community")}
            >
              Foros
            </span>
            <span className="text-gray-400">/</span>
            <span
              className="text-gray-500 dark:text-gray-400 hover:text-amber-500 cursor-pointer transition-colors"
              onClick={() => navigate("/community")}
            >
              {post.topic?.title || "General"}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          {/* 2. TOOLBAR (Seguir, Compartir, Volver) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button className={toolBtnClass}>
                <Bookmark size={16} />
                <span>Seguir Tema</span>
              </button>
              <button className={toolBtnClass}>
                <Share2 size={16} />
                <span>Compartir</span>
              </button>
            </div>
            <button
              onClick={() => navigate("/community")}
              className={toolBtnClass}
            >
              <ArrowLeft size={16} />
              <span>Volver a Foros</span>
            </button>
          </div>

          {/* 3. TÍTULO PRINCIPAL */}
          <div className="px-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              {post.title}
            </h1>
          </div>

          {/* 4. MAIN POST CARD (Estilo Stitch: Avatar Izq, Contenido Der) */}
          <div className="flex w-full flex-row items-start gap-4 rounded-xl border border-amber-500/30 bg-white dark:bg-[#111] p-6 shadow-sm">
            {/* Columna Avatar */}
            <div className="shrink-0 hidden sm:block">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-white/10"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-lg">
                  {getInitials(displayName)}
                </div>
              )}
            </div>

            {/* Columna Contenido */}
            <div className="flex flex-1 flex-col gap-3 min-w-0">
              {/* Header del Post: Nombre, Tiempo, Acciones */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Avatar visible en móvil aquí */}
                  <div className="sm:hidden h-8 w-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xs">
                    {getInitials(displayName)}
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {displayName}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    hace {timeAgo(post.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <>
                      <button
                        onClick={handleStartEditPost}
                        className={iconBtnClass}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletePostOpen(true)}
                        className={`${iconBtnClass} hover:text-red-500`}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button className={iconBtnClass} title="Reportar">
                      <Flag size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Cuerpo del Texto */}
              {!editingPost ? (
                <div className="text-gray-700 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn w-full">
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    value={editPostData.title}
                    onChange={(e) =>
                      setEditPostData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-neutral-950 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-neutral-50 outline-none field-sizing-content"
                    value={editPostData.content}
                    onChange={(e) =>
                      setEditPostData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingPost(false)}
                      className="px-3 py-1.5 rounded text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSavePostEdit}
                      className="px-3 py-1.5 rounded text-sm bg-amber-500 text-black font-bold"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              {!editingPost && (
                <div className="flex items-center gap-6 pt-2 mt-1">
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors">
                    <ThumbsUp size={18} />
                    <span className="text-sm font-medium">
                      {post.likeCount || 0}
                    </span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-white transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-sm font-medium">Responder</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5. SEPARATOR */}
          <div className="flex items-center gap-4 py-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Comentarios
            </h3>
            <hr className="flex-1 border-t border-gray-200 dark:border-white/10" />
          </div>

          {/* 6. COMMENTS LIST */}
          <div className="flex flex-col gap-4">
            {comments && comments.length > 0 ? (
              comments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  user={user}
                  updateLocalComment={updateLocalComment}
                  removeLocalComment={removeLocalComment}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Aún no hay comentarios.
              </p>
            )}
          </div>

          {/* 7. REPLY AREA (Rich Text Style) */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Publicar una respuesta
              </h3>
              <hr className="flex-1 border-t border-gray-200 dark:border-white/10" />
            </div>

            <div className="flex flex-col rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] p-4 shadow-sm focus-within:ring-1 focus-within:ring-amber-500/50 transition-all">
              <textarea
                className="w-full min-h-[120px] bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 resize-y p-0 text-base"
                placeholder={
                  user
                    ? "Escribe tu respuesta..."
                    : "Inicia sesión para participar."
                }
                disabled={!user}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              {/* Visual Toolbar Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 mt-3 pt-3">
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Bold size={18} />
                  </button>
                  <button className="p-2 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <Italic size={18} />
                  </button>
                  <button className="p-2 rounded text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <LinkIcon size={18} />
                  </button>
                </div>

                <button
                  onClick={handleAddComment}
                  disabled={!user || !newComment.trim()}
                  className={`
                            flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm
                            bg-amber-500 text-black shadow-lg shadow-amber-500/10
                            transition-all duration-200
                            ${
                              user && newComment.trim()
                                ? "hover:bg-amber-600 hover:translate-y-[-1px]"
                                : "opacity-50 cursor-not-allowed"
                            }
                        `}
                >
                  <span>Publicar Respuesta</span>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- DELETE MODAL --- */}
      {deletePostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#191919] p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <Trash2 size={20} /> Eliminar Publicación
              </h2>
              <button
                onClick={() => setDeletePostOpen(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              ¿Seguro que quieres eliminar esta discusión? <br />
              <span className="text-red-500 text-sm font-semibold">
                Esta acción es irreversible.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletePostOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 flex items-center gap-2"
              >
                {isDeleting ? "..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper pequeño para tiempo relativo (duplicado si no lo tienes global)
const timeAgo = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "menos de 1h";
  if (hours < 24) return `${hours} horas`;
  return `${Math.floor(hours / 24)} días`;
};

export default PostDetailPage;
