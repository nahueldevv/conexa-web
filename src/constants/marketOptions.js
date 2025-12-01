export const CARGO_TYPES = [
  { value: "carga general", label: "General" },
  { value: "perecederos", label: "Perecederos" },
  { value: "granel", label: "Granel" },
  { value: "embalada", label: "Embaladas" }
]

// Usamos "LOCATIONS" en lugar de "ORIGINS" para usarlo tambien en "Destination"
export const AVAILABLE_LOCATIONS = [
  // --- FOCO CENTRAL: ARGENTINA (Orígenes, Hubs y Aduanas) ---
  { value: "San Salvador de Jujuy, AR", label: "San Salvador de Jujuy, AR" },
  { value: "Salta, AR", label: "Salta, AR" },
  { value: "Paso de Jama, AR/CL", label: "Paso de Jama (Aduana)" }, // Cruce Fronterizo Clave
  { value: "Gral. Güemes, AR", label: "Gral. Güemes (Nodo Logístico)" }, // Centro de Distribución y Transbordo
  
  // --- PUERTOS PACÍFICOS (CHILE) ---
  { value: "Antofagasta, CL", label: "Antofagasta, CL (Puerto)" }, // Principal puerto de destino
  { value: "Mejillones, CL", label: "Mejillones, CL (Puerto)" }, // Puerto con mayor capacidad de carga
  { value: "Iquique, CL", label: "Iquique, CL (Puerto)" },
  
  // --- NODOS DE TRÁNSITO Y ATLÁNTICO (PY/BR) ---
  { value: "Asunción, PY", label: "Asunción, PY (Hub)" },
  { value: "Pozo Hondo, PY/AR", label: "Pozo Hondo (Aduana)" }, // Cruce Fronterizo (Futura Salida)
  { value: "Campo Grande, BR", label: "Campo Grande, BR (Hub)" }, // Gran centro de distribución
  { value: "Santos, BR", label: "Santos, BR (Puerto)" } // Mayor puerto del Atlántico
]

// Helper para obtener label dado un value (útil para las cards)
export const getCargoLabel = (value) => {
  const type = CARGO_TYPES.find(t => t.value === value)
  return type ? type.label : value
}