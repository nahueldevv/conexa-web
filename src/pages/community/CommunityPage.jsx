import { Link } from "react-router-dom"

function CommunityPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-neutral-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* 2-column layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          
          {/* Sidebar */}
          <aside className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 md:col-span-1">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Navegación Comunitaria
            </h2>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                to="#"
                className="rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:text-cyan-300 dark:hover:bg-neutral-700"
              >
                Foros
              </Link>
              <Link
                to="#"
                className="rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:text-cyan-300 dark:hover:bg-neutral-700"
              >
                Recursos
              </Link>
              <Link
                to="#"
                className="rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:text-cyan-300 dark:hover:bg-neutral-700"
              >
                Proyectos
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 md:col-span-3">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Bienvenido al Portal Comunitario
            </h1>

            <p className="mt-4 text-neutral-600 dark:text-neutral-300">
              Este es el hub principal para colaboración logistica, compartir conocimiento, y proyectos compartidos alrededor de los miembros de CONEXA. 
              Todas las tarjetas mostradas aqui son placeholders para las participaciones futuras de la comunidad.    
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
                <h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                  Foros
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Participá en discusiones, realizá preguntas, y colaborá con pares. 
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
                <h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                  Recursos
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Accede a documentacion, guías, herramientas, y las mejores prácticas de logistica.
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
                <h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                  Proyectos
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Busca y unite a los proyectos de inovación líderes de la comunidad.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CommunityPage
