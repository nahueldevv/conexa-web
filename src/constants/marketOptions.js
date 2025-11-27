export const CARGO_TYPES = [
  { value: "carga general", label: "General" },
  { value: "perecederos", label: "Perecederos" },
  { value: "granel", label: "Granel" },
  { value: "embalada", label: "Embaladas" }
]

// Usamos "LOCATIONS" en lugar de "ORIGINS" para usarlo tambien en "Destination"
export const AVAILABLE_LOCATIONS = [
  // Pacific Ports (Chile)
  { value: "Antofagasta, CL", label: "Antofagasta, CL" },
  { value: "Iquique, CL", label: "Iquique, CL" },
  
  // Argentina (Mid-Corridor Hubs - near Andes Passes)
  { value: "San Salvador de Jujuy, AR", label: "San Salvador de Jujuy, AR" },
  { value: "Salta, AR", label: "Salta, AR" },
  { value: "Resistencia, AR", label: "Resistencia, AR" },
  
  // Paraguay (Central Hub)
  { value: "Asunción, PY", label: "Asunción, PY" },
  
  // Brazil (Atlantic Mid-Corridor & Port Access)
  { value: "Campo Grande, BR", label: "Campo Grande, BR" },
  { value: "Santos, BR", label: "Santos, BR" } // Key Atlantic Port
]

// Helper para obtener label dado un value (útil para las cards)
export const getCargoLabel = (value) => {
  const type = CARGO_TYPES.find(t => t.value === value)
  return type ? type.label : value
}