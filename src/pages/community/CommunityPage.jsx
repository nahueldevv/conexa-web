import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useCommunityHome } from "../../hooks/useCommunityHome"
import { getPosts } from "../../services/community.service"
import { useNavigate } from "react-router-dom"
import {
  PlusCircle,
  Loader,
  BarChart2,
  Truck,
  Zap,
  Users,
  ArrowRight,
  Gavel,
  Route,
  Package,
  MessageSquare,
  ThumbsUp,
  Hash,
} from "lucide-react"
import Navbar from "../../components/layout/NavBar"

// --- SUB-COMPONENTE: DASHBOARD DE ESTADÍSTICAS ---
const CommunityStats = () => (
  <section className="flex flex-col gap-4">
    <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F5F5]">
      Dashboard de Estadísticas Comunitarias
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-[#F5F5F5] font-medium">
            Tránsito Promedio
          </p>
          <Truck className="text-gray-400" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          4.2 Días
        </p>
        <p className="text-red-500 text-sm font-bold">-0.1%</p>
      </div>
      {/* Card 2 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-[#F5F5F5] font-medium">
            Envíos Activos
          </p>
          <BarChart2 className="text-gray-400" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          1,204
        </p>
        <p className="text-green-500 text-sm font-bold">+5.2%</p>
      </div>
      {/* Card 3 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-[#F5F5F5] font-medium">
            Eficiencia
          </p>
          <Zap className="text-gray-400" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          98.7%
        </p>
        <p className="text-green-500 text-sm font-bold">+0.3%</p>
      </div>
      {/* Card 4 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-[#F5F5F5] font-medium">
            Nuevos Miembros
          </p>
          <Users className="text-gray-400" size={20} />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">+28</p>
        <p className="text-green-500 text-sm font-bold">+12%</p>
      </div>
    </div>
  </section>
)

// --- SUB-COMPONENTE: NOVEDADES (Grid de 3) ---
const NewsSection = () => (
  <section className="flex flex-col gap-4">
    <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F5F5]">
      Novedades
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* News 1 */}
      <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm group cursor-pointer">
        <div
          className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrWz8U7S1Z8ACuCZzoBNRzudTVBIVmlW8CQpWWK8S6wbO_iaUOJ-R83azdZnqskWLZFqQRFqVg9HMVeuwUquibmKuvOgXt-3DsvDydv4YbFyFQdNL4W15eUZnB1ZrRI7RY8HtcJdHaX-H0djmnaLK9TR5KjKgqUZTU6gSpc6nJKvd2CuuNx6DPwh-Vlh6DKjWfY613V8BDMQTKPLGSPPWhje4c5Pl8SFWmVH3e02E8MQ4PfKiGjluNrJPXWLh1qnal3YPF_1ZGO-5-')",
          }}
        ></div>
        <div className="p-5 pt-0 flex flex-col gap-2 pb-6">
          <h3 className="text-gray-900 dark:text-[#F5F5F5] text-lg font-bold leading-tight group-hover:text-amber-500 transition-colors">
            CONEXA introduce optimización de rutas con IA
          </h3>
          <p className="text-gray-500 dark:text-[#888888] text-sm line-clamp-2">
            Nuestra nueva tecnología está lista para revolucionar la eficiencia
            de la cadena de suministro.
          </p>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-sm font-bold mt-2">
            Leer más <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* News 2 */}
      <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm group cursor-pointer">
        <div
          className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrWz8U7S1Z8ACuCZzoBNRzudTVBIVmlW8CQpWWK8S6wbO_iaUOJ-R83azdZnqskWLZFqQRFqVg9HMVeuwUquibmKuvOgXt-3DsvDydv4YbFyFQdNL4W15eUZnB1ZrRI7RY8HtcJdHaX-H0djmnaLK9TR5KjKgqUZTU6gSpc6nJKvd2CuuNx6DPwh-Vlh6DKjWfY613V8BDMQTKPLGSPPWhje4c5Pl8SFWmVH3e02E8MQ4PfKiGjluNrJPXWLh1qnal3YPF_1ZGO-5-')",
          }}
        ></div>
        <div className="p-5 pt-0 flex flex-col gap-2 pb-6">
          <h3 className="text-gray-900 dark:text-[#F5F5F5] text-lg font-bold leading-tight group-hover:text-amber-500 transition-colors">
            Expansión de operaciones al Sudeste Asiático
          </h3>
          <p className="text-gray-500 dark:text-[#888888] text-sm line-clamp-2">
            Estamos emocionados de anunciar nuevas rutas y centros logísticos en
            mercados clave.
          </p>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-sm font-bold mt-2">
            Leer más <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* News 3 */}
      <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 shadow-sm group cursor-pointer">
        <div
          className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVz4dgGNvXetk_8LASrp-CgA2mgXLwbdDybWgr5xojiUaAXtld0_o0pPzfzDV_n5J_ypqOp55DieoVh8fCE8Ysv2P_O-fqZID9Htm1oLqBGT7m_6coRqn9vXUcYfq5JQ91N0d_YG7tb4VNipYeDIvHNujFVUm6WyDGGhyex6IFyqlk1yNSt6JczFsDOBY9fkMRLQgSE5ZR3a62nNJH22WhL3P_vKvCKTQ_v7hhz9LtelOspv3m61pdGjE3bTIeJXUiEnE_R3id8Q-E')",
          }}
        ></div>
        <div className="p-5 pt-0 flex flex-col gap-2 pb-6">
          <h3 className="text-gray-900 dark:text-[#F5F5F5] text-lg font-bold leading-tight group-hover:text-amber-500 transition-colors">
            Reporte Trimestral de Sostenibilidad
          </h3>
          <p className="text-gray-500 dark:text-[#888888] text-sm line-clamp-2">
            Descubre cómo estamos reduciendo nuestra huella de carbono y
            promoviendo prácticas ecológicas.
          </p>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-sm font-bold mt-2">
            Leer más <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  </section>
)

// --- COMPONENTE PRINCIPAL ---
const CommunityPage = () => {
  const { isAuthenticated } = useAuth()
  const { forums, feed, loading, error } = useCommunityHome()
  const navigate = useNavigate()

  const [displayedPosts, setDisplayedPosts] = useState([])
  const [activeForum, setActiveForum] = useState("general")

  // Inicializa posts
  useEffect(() => {
    if (feed && feed.length > 0) {
      setDisplayedPosts(feed)
    }
  }, [feed])

  // Manejo de clicks en foros
  const handleForumClick = async (forumId) => {
    setActiveForum(forumId)
    try {
      // Lógica de filtrado
      const topicId = forumId === "general" ? "general" : forumId
      const filteredPosts = await getPosts({ topicId })
      setDisplayedPosts(filteredPosts)
    } catch (err) {
      console.error("Error filtrando posts:", err)
    }
  }

  const timeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Reciente"
    if (diffInHours < 24) return `hace ${diffInHours} horas`
    return `hace ${Math.floor(diffInHours / 24)} días`
  }

  // Icon Mapper para Foros
  const getForumIcon = (title) => {
    const t = title.toLowerCase()
    if (t.includes("aduana") || t.includes("regulación"))
      return <Gavel size={24} />
    if (t.includes("ruta") || t.includes("transporte"))
      return <Route size={24} />
    if (t.includes("almacen") || t.includes("logística"))
      return <Package size={24} />
    return <MessageSquare size={24} />
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#0A0A0A] flex justify-center items-center">
        <Loader size={48} className="animate-spin text-amber-500" />
      </main>
    )
  }

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error cargando comunidad.
      </div>
    )

  return (
    <>
      {!isAuthenticated && <Navbar />}

      <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display flex flex-col transition-colors">
        <div className="flex-1 px-4 sm:px-8 md:px-12 py-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            {/* --- HEADER --- */}
            <div className="flex flex-wrap justify-between gap-4 items-center">
              <div className="flex flex-col gap-1">
                <h1 className="text-gray-900 dark:text-[#F5F5F5] text-4xl font-black leading-tight tracking-[-0.033em]">
                  Portal Comunitario
                </h1>
                <p className="text-gray-500 dark:text-[#888888] text-base font-normal">
                  Bienvenido al centro de la comunidad CONEXA.
                </p>
              </div>
              <button
                onClick={() => navigate("/community/create")}
                className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <PlusCircle size={18} />
                <span>Crear Nuevo Post</span>
              </button>
            </div>

            {/* --- STATS SECTION --- */}
            <CommunityStats />

            {/* --- NEWS SECTION --- */}
            <NewsSection />

            {/* --- MAIN CONTENT GRID (Forums Left / Posts Right) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LEFT: FOROS DE DISCUSIÓN */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F5F5]">
                  Foros de Discusión
                </h2>

                <div className="flex flex-col gap-3">
                  {/* Foro General */}
                  <div
                    onClick={() => handleForumClick("general")}
                    className={`flex items-center gap-4 rounded-xl p-4 cursor-pointer transition-all border ${
                      activeForum === "general"
                        ? "bg-white dark:bg-[#191919] border-amber-500 shadow-md ring-1 ring-amber-500/50"
                        : "bg-white dark:bg-[#191919] border-gray-200 dark:border-white/5 hover:border-amber-500/50"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center size-12 rounded-lg ${
                        activeForum === "general"
                          ? "bg-amber-500 text-black"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                      }`}
                    >
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-[#F5F5F5] font-bold">
                        General
                      </p>
                      <p className="text-xs text-gray-500 dark:text-[#888888]">
                        Discusión abierta
                      </p>
                    </div>
                  </div>

                  {/* Foros Dinámicos */}
                  {forums.map((forum) => (
                    <div
                      key={forum.id}
                      onClick={() => handleForumClick(forum.id)}
                      className={`flex items-center gap-4 rounded-xl p-4 cursor-pointer transition-all border ${
                        activeForum === forum.id
                          ? "bg-white dark:bg-[#191919] border-amber-500 shadow-md ring-1 ring-amber-500/50"
                          : "bg-white dark:bg-[#191919] border-gray-200 dark:border-white/5 hover:border-amber-500/50"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center size-12 rounded-lg ${
                          activeForum === forum.id
                            ? "bg-amber-500 text-black"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                        }`}
                      >
                        {getForumIcon(forum.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-[#F5F5F5] font-bold truncate">
                          {forum.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#888888] line-clamp-1">
                          {forum.description || "Temas especializados"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: PUBLICACIONES GENERALES */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#F5F5F5]">
                  {activeForum === "general"
                    ? "Publicaciones Recientes"
                    : forums.find((f) => f.id === activeForum)?.title ||
                      "Posts"}
                </h2>

                <div className="flex flex-col gap-4">
                  {displayedPosts.length === 0 ? (
                    <div className="p-12 text-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-gray-500">
                        No hay publicaciones en esta sección.
                      </p>
                    </div>
                  ) : (
                    displayedPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => navigate(`/community/post/${post.id}`)}
                        className="rounded-xl bg-white dark:bg-[#191919] border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:border-amber-500/30 transition-all group"
                      >
                        {/* Header Post */}
                        <div className="flex items-center gap-3">
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-white/10"
                            style={{
                              backgroundImage: `url('${
                                post.author?.avatar ||
                                "https://ui-avatars.com/api/?name=" +
                                  (post?.userName || "U") +
                                  "&background=random"
                              }')`,
                            }}
                          ></div>
                          <div className="flex flex-col">
                            <p className="text-gray-900 dark:text-[#F5F5F5] text-sm font-bold group-hover:text-amber-500 transition-colors">
                              {post?.userName || "Anónimo"}
                            </p>
                            <p className="text-gray-500 dark:text-[#888888] text-xs">
                              {timeAgo(post.created_at)} •{" "}
                              {post.topic?.title || "General"}
                            </p>
                          </div>
                        </div>

                        {/* Content Post */}
                        <div>
                          <h4 className="text-gray-900 dark:text-[#F5F5F5] text-lg font-bold leading-tight mb-2">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 dark:text-[#888888] text-sm line-clamp-2 leading-relaxed">
                            {post.description || post.content}
                          </p>
                        </div>

                        {/* Footer Icons */}
                        <div className="flex items-center gap-6 mt-2 pt-3 border-t border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-amber-500 transition-colors">
                            <ThumbsUp size={16} />
                            <span className="text-xs font-bold">
                              {post.likeCount || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-amber-500 transition-colors">
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold">
                              {post.commentCount || 0} comentarios
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CommunityPage
