import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

function CommunityPage() {
  const [animate, setAnimate] = useState(false)
  const [filter, setFilter] = useState("all")

  // Mock data (se reemplaza con backend real)
  const activities = [
    {
      id: 1,
      type: "foro",
      title: "Nueva discusión: Optimización de Cargas",
      desc: "Transportistas comparten técnicas para maximizar la capacidad sin comprometer tiempos.",
      date: "Hace 2 horas"
    },
    {
      id: 2,
      type: "recurso",
      title: "Guía PDF: Buenas prácticas de transporte en frío",
      desc: "Documento con estándares actuales para transporte refrigerado.",
      date: "Ayer"
    },
    {
      id: 3,
      type: "proyecto",
      title: "Proyecto: Blockchain Logístico Norte",
      desc: "Iniciativa colaborativa para trazabilidad de cargas.",
      date: "Hace 3 días"
    },
    {
      id: 4,
      type: "foro",
      title: "Pregunta abierta: ¿Qué apps usan para seguimiento?",
      desc: "La comunidad comparte herramientas útiles.",
      date: "Hace 5 horas"
    }
  ]

  const filtered = filter === "all"
    ? activities
    : activities.filter(a => a.type === filter)

  useEffect(() => {
    setTimeout(() => setAnimate(true), 50)
  }, [])

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-neutral-50 dark:bg-neutral-900">
      <div
        className={`mx-auto max-w-7xl px-4 py-10 transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <h1 className="mb-6 text-4xl font-bold text-cyan-700 dark:text-cyan-300">
        Portal Comunitario
        </h1>

        {/* 2 columns layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

          {/* SIDEBAR */}
          <aside
            className={`
              space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-md
              dark:border-neutral-700 dark:bg-neutral-800 
              transform transition-all duration-700 ease-out
              ${animate ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}
              md:col-span-1
            `}
          >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Navegación 
            </h2>

            <nav className="mt-4 flex flex-col gap-2">

              {/* Filtros del Sidebar */}
              <button
                onClick={() => setFilter("all")}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium 
                  transition-all duration-300 
                  ${filter === "all"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-neutral-700"}`}
              >
                Todo
              </button>

              <button
                onClick={() => setFilter("foro")}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium 
                  transition-all duration-300 
                  ${filter === "foro"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-neutral-700"}`}
              >
                Foros
              </button>

              <button
                onClick={() => setFilter("recurso")}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium 
                  transition-all duration-300 
                  ${filter === "recurso"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-neutral-700"}`}
              >
                Recursos
              </button>

              <button
                onClick={() => setFilter("proyecto")}
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium 
                  transition-all duration-300 
                  ${filter === "proyecto"
                    ? "bg-cyan-600 text-white"
                    : "text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-neutral-700"}`}
              >
                Proyectos
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main
            className={`
              rounded-xl border border-neutral-200 bg-white p-6 shadow-md
              dark:border-neutral-700 dark:bg-neutral-800 
              transition-all duration-700 transform
              ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
              md:col-span-3
            `}
          >
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Actividad Reciente
            </h1>

            <p className="mt-4 text-neutral-600 dark:text-neutral-300">
              Todas las interacciones recientes de la comunidad serán reflejadas aquí:
              publicaciones, proyectos, preguntas y nuevos recursos.
            </p>

            {/* CARDS DE ACTIVIDAD */}
           
            <div
               key={filter}
              className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 transition-all duration-300"
            >

              {filtered.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-sm
                    dark:border-neutral-700 dark:bg-neutral-900/40
                    transition-all duration-500 hover:shadow-md 
                    hover:bg-neutral-100/60 dark:hover:bg-neutral-800 
                    opacity-0 animate-fadeIn"
                >
                  <h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {item.desc}
                  </p>

                  <p className="mt-3 text-xs font-medium text-neutral-500 dark:text-neutral-500">
                    {item.date}
                  </p>
                </div>
              ))}
              
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
