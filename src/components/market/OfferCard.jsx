function OfferCard({ item }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      
      {/* Header */}
      <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">
        Oferta de Transporte
      </h3>

      {/* Body */}
      <div className="mt-3 space-y-1">
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Origen:
          </span>{" "}
          {item?.origin || "N/A"}
        </p>

        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Destino:
          </span>{" "}
          {item?.destination || "N/A"}
        </p>

        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Tipo:
          </span>{" "}
          {item?.type || "N/A"}
        </p>

        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Fecha:
          </span>{" "}
          {item?.date || "N/A"}
        </p>
      </div>
    </div>
  )
}

export default OfferCard
