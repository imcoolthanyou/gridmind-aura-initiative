// Shared transformer data store for both Khandwa and Bhopal regions

export interface GridNode {
  id: string
  name: string
  type: "transformer" | "substation" | "generator"
  position: { lat: number; lng: number }
  status: "healthy" | "warning" | "critical" | "failed"
  healthScore: number
  connections: string[]
  voltage: number
  load: number
  temperature: number
  region: "khandwa" | "bhopal"
}

export interface PowerLine {
  id: string
  from: string
  to: string
  status: "normal" | "overload" | "failed"
  capacity: number
  currentLoad: number
}

// Combined transformer data for Khandwa and Bhopal regions
export const gridNodes: GridNode[] = [
  // Khandwa region (existing)
  {
    id: "KHD-SUB-001",
    name: "Khandwa Main Substation",
    type: "substation",
    position: { lat: 21.8270, lng: 76.3504 },
    status: "healthy",
    healthScore: 92,
    connections: ["KHD-T-001", "KHD-T-002", "KHD-SUB-002"],
    voltage: 132000,
    load: 85,
    temperature: 42,
    region: "khandwa"
  },
  {
    id: "KHD-T-001",
    name: "Industrial Zone Transformer",
    type: "transformer",
    position: { lat: 21.8350, lng: 76.3420 },
    status: "warning",
    healthScore: 68,
    connections: ["KHD-SUB-001", "KHD-T-003"],
    voltage: 33000,
    load: 92,
    temperature: 87,
    region: "khandwa"
  },
  {
    id: "KHD-T-002",
    name: "Residential North Transformer",
    type: "transformer",
    position: { lat: 21.8400, lng: 76.3580 },
    status: "critical",
    healthScore: 34,
    connections: ["KHD-SUB-001", "KHD-T-004"],
    voltage: 11000,
    load: 98,
    temperature: 124,
    region: "khandwa"
  },
  {
    id: "KHD-SUB-002",
    name: "East District Substation",
    type: "substation",
    position: { lat: 21.8200, lng: 76.3650 },
    status: "healthy",
    healthScore: 88,
    connections: ["KHD-SUB-001", "KHD-T-005"],
    voltage: 66000,
    load: 73,
    temperature: 45,
    region: "khandwa"
  },
  {
    id: "KHD-T-003",
    name: "Commercial Hub Transformer",
    type: "transformer",
    position: { lat: 21.8150, lng: 76.3380 },
    status: "healthy",
    healthScore: 94,
    connections: ["KHD-T-001", "KHD-T-006"],
    voltage: 11000,
    load: 67,
    temperature: 38,
    region: "khandwa"
  },
  {
    id: "KHD-T-004",
    name: "Narmada Bank Transformer",
    type: "transformer",
    position: { lat: 21.8450, lng: 76.3700 },
    status: "warning",
    healthScore: 71,
    connections: ["KHD-T-002"],
    voltage: 11000,
    load: 89,
    temperature: 78,
    region: "khandwa"
  },
  {
    id: "KHD-T-005",
    name: "Agricultural Feeder",
    type: "transformer",
    position: { lat: 21.8100, lng: 76.3720 },
    status: "healthy",
    healthScore: 91,
    connections: ["KHD-SUB-002"],
    voltage: 11000,
    load: 54,
    temperature: 41,
    region: "khandwa"
  },
  {
    id: "KHD-T-006",
    name: "Railway Station Transformer",
    type: "transformer",
    position: { lat: 21.8050, lng: 76.3300 },
    status: "healthy",
    healthScore: 89,
    connections: ["KHD-T-003"],
    voltage: 11000,
    load: 62,
    temperature: 43,
    region: "khandwa"
  },
  // Bhopal region (new)
  {
    id: "BHP-SUB-001",
    name: "Bhopal Central Substation",
    type: "substation",
    position: { lat: 23.2599, lng: 77.4126 }, // Bhopal center
    status: "healthy",
    healthScore: 95,
    connections: ["BHP-T-001", "BHP-T-002", "BHP-SUB-002"],
    voltage: 220000,
    load: 78,
    temperature: 38,
    region: "bhopal"
  },
  {
    id: "BHP-T-001",
    name: "Transformer TX-47B", // From existing data
    type: "transformer",
    position: { lat: 23.2800, lng: 77.4200 }, // North Bhopal
    status: "warning",
    healthScore: 75,
    connections: ["BHP-SUB-001", "BHP-T-003"],
    voltage: 33000,
    load: 85,
    temperature: 78,
    region: "bhopal"
  },
  {
    id: "BHP-T-002",
    name: "Transformer TX-52A", // From existing data
    type: "transformer",
    position: { lat: 23.2599, lng: 77.4300 }, // Central Bhopal
    status: "healthy",
    healthScore: 88,
    connections: ["BHP-SUB-001", "BHP-T-004"],
    voltage: 11000,
    load: 67,
    temperature: 45,
    region: "bhopal"
  },
  {
    id: "BHP-T-003",
    name: "Transformer TX-63C", // From existing data
    type: "transformer",
    position: { lat: 23.2400, lng: 77.4050 }, // South Bhopal
    status: "critical",
    healthScore: 42,
    connections: ["BHP-T-001"],
    voltage: 11000,
    load: 95,
    temperature: 115,
    region: "bhopal"
  },
  {
    id: "BHP-T-004",
    name: "Transformer TX-71D", // From existing data
    type: "transformer",
    position: { lat: 23.2650, lng: 77.4500 }, // East Bhopal
    status: "healthy",
    healthScore: 91,
    connections: ["BHP-T-002"],
    voltage: 11000,
    load: 58,
    temperature: 41,
    region: "bhopal"
  },
  {
    id: "BHP-T-005",
    name: "Transformer TX-85F", // From existing data
    type: "transformer",
    position: { lat: 23.2700, lng: 77.3800 }, // West Bhopal
    status: "warning",
    healthScore: 73,
    connections: ["BHP-SUB-002"],
    voltage: 11000,
    load: 89,
    temperature: 72,
    region: "bhopal"
  },
  {
    id: "BHP-SUB-002",
    name: "Bhopal Industrial Substation",
    type: "substation",
    position: { lat: 23.2300, lng: 77.3900 }, // Industrial area
    status: "healthy",
    healthScore: 87,
    connections: ["BHP-SUB-001", "BHP-T-005"],
    voltage: 132000,
    load: 82,
    temperature: 48,
    region: "bhopal"
  }
]

// Power lines connecting nodes
export const powerLines: PowerLine[] = [
  // Khandwa connections
  { id: "L001", from: "KHD-SUB-001", to: "KHD-T-001", status: "normal", capacity: 50, currentLoad: 46 },
  { id: "L002", from: "KHD-SUB-001", to: "KHD-T-002", status: "overload", capacity: 30, currentLoad: 32 },
  { id: "L003", from: "KHD-SUB-001", to: "KHD-SUB-002", status: "normal", capacity: 100, currentLoad: 73 },
  { id: "L004", from: "KHD-T-001", to: "KHD-T-003", status: "normal", capacity: 25, currentLoad: 17 },
  { id: "L005", from: "KHD-T-002", to: "KHD-T-004", status: "normal", capacity: 20, currentLoad: 18 },
  { id: "L006", from: "KHD-SUB-002", to: "KHD-T-005", status: "normal", capacity: 15, currentLoad: 8 },
  { id: "L007", from: "KHD-T-003", to: "KHD-T-006", status: "normal", capacity: 15, currentLoad: 9 },
  
  // Bhopal connections
  { id: "L008", from: "BHP-SUB-001", to: "BHP-T-001", status: "normal", capacity: 60, currentLoad: 51 },
  { id: "L009", from: "BHP-SUB-001", to: "BHP-T-002", status: "normal", capacity: 40, currentLoad: 27 },
  { id: "L010", from: "BHP-SUB-001", to: "BHP-SUB-002", status: "normal", capacity: 150, currentLoad: 123 },
  { id: "L011", from: "BHP-T-001", to: "BHP-T-003", status: "overload", capacity: 25, currentLoad: 28 },
  { id: "L012", from: "BHP-T-002", to: "BHP-T-004", status: "normal", capacity: 20, currentLoad: 12 },
  { id: "L013", from: "BHP-SUB-002", to: "BHP-T-005", status: "normal", capacity: 30, currentLoad: 27 }
]

// Function to get nodes by region
export const getNodesByRegion = (region: "khandwa" | "bhopal") => {
  return gridNodes.filter(node => node.region === region)
}

// Function to get all transformer options for data ingestion
export const getAllTransformers = () => {
  return gridNodes.filter(node => node.type === "transformer")
}

// Function to add/update transformer from data ingestion
export const updateTransformerFromIngestion = (transformerId: string, updates: Partial<GridNode>) => {
  const index = gridNodes.findIndex(node => node.id === transformerId)
  if (index >= 0) {
    Object.assign(gridNodes[index], updates)
  }
  return gridNodes[index]
}

// Function to add new transformer
export const addNewTransformer = (transformer: GridNode) => {
  gridNodes.push(transformer)
  return transformer
}