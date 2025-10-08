# AURA - Advanced Utility Reliability Assessment System

## 📋 Project Overview

AURA is a comprehensive diagnostic and predictive maintenance platform for electrical grid infrastructure, specifically designed for transformer health monitoring and analysis. The system combines advanced AI analytics, 3D digital twin visualization, and CSV-based data ingestion to provide real-time insights into transformer performance and reliability.

## 🏗️ System Architecture

### Technology Stack
- **Frontend Framework**: Next.js 14 with TypeScript
- **UI Library**: React with Tailwind CSS
- **3D Visualization**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Animations**: Framer Motion
- **State Management**: localStorage with React hooks
- **Build Tool**: Next.js with Turbopack
- **Development Environment**: Node.js with TypeScript

### Project Structure
```
src/
├── app/                          # Next.js app router pages
│   ├── data-ingestion/          # CSV upload and transformer configuration
│   ├── aura-analysis/           # AI analysis and verdict display
│   ├── diagnostics/             # Main dashboard with digital twin
│   ├── grid-command/            # Grid management interface
│   ├── training/                # Training simulation environment
│   ├── ar/                      # Augmented reality features
│   └── technology/              # Technology overview page
├── components/                   # Reusable React components
│   ├── ui/                      # Base UI components
│   ├── DataIngestionPortal.tsx  # CSV upload interface
│   ├── AURAAnalysis.tsx         # AI analysis engine
│   ├── DiagnosticsDashboard.tsx # Main diagnostic interface
│   ├── TransformerModel.tsx     # 3D digital twin component
│   ├── LiveSensorStreams.tsx    # Real-time sensor data display
│   ├── FusionDiagnostics.tsx    # Multi-modal diagnostic fusion
│   └── [other components]       # Supporting components
└── lib/                         # Utility functions and hooks
```

## 🔄 Application Flow & User Journey

### 1. Data Ingestion Portal (`/data-ingestion`)
**Purpose**: CSV data upload and transformer configuration

**Features**:
- Interactive Bhopal grid map with transformer asset selection
- Drag-and-drop CSV file upload interface
- Transformer configuration options:
  - **Create New Transformer**: Generate new asset with custom naming
  - **Update Existing Transformer**: Update selected transformer with new data
- Real-time configuration preview
- Input validation for test ID and engineer information

**Data Flow**:
```
CSV Upload → Asset Selection → Transformer Configuration → Data Validation → AURA Analysis
```

### 2. AURA Analysis Engine (`/aura-analysis`)
**Purpose**: AI-powered diagnostic analysis with cinematic presentation

**Features**:
- **Phase 1**: 5-second full-screen animation sequence
  - Data ingestion and parsing visualization
  - Signature correlation analysis
  - Neural network inference display
  - Verdict generation animation
- **Phase 2**: Static results presentation
  - Comprehensive analysis verdict
  - Health score calculation (based on transformer status)
  - Risk assessment with timeline
  - AI-generated insights and recommendations

**Analysis Logic**:
- **New Transformers**: Health score 60-100% (generally healthy)
- **Existing Transformers**: Status-based scoring
  - Healthy: 80-100%
  - Warning: 50-70%
  - Critical: 20-50%

### 3. Diagnostics Dashboard (`/diagnostics`)
**Purpose**: Comprehensive monitoring and digital twin interface

**Components**:

#### A. Asset Selector & Status Overview
- Dropdown selector for transformer switching
- Real-time health score display
- Status indicator synchronization
- CSV data integration support

#### B. Digital Twin Model (3D Visualization)
- Interactive 3D transformer representation
- CSV-based component mapping
- Health indicator overlays with status colors:
  - Green: Healthy components
  - Amber: Warning conditions
  - Red: Critical issues
- Real-time component selection and detailed tooltips
- Professional lighting and material rendering

#### C. Live Sensor Streams
- Static CSV-based sensor data display
- Multiple diagnostic modalities:
  - **Acoustic Emission**: Winding condition monitoring
  - **IR Thermography**: Thermal analysis
  - **Dissolved Gas Analysis**: Oil condition assessment
  - **Frequency Response**: Electrical integrity
  - **Vibration Analysis**: Mechanical condition
- Trend visualization with historical context

#### D. Fusion Diagnostics
- Multi-modal correlation analysis
- Health score aggregation
- Risk assessment algorithms
- Predictive maintenance recommendations

#### E. AI Reporting
- Automated report generation
- Key findings summarization
- Maintenance scheduling recommendations
- Historical trend analysis

## 🔧 Key Technical Implementations

### CSV-Based Data Processing
```typescript
// Transformer data structure
interface TransformerData {
  transformerId: string
  name: string
  location: string
  healthScore: number
  sensors: {
    [key: string]: {
      value: number
      unit: string
      status: 'active' | 'warning' | 'anomaly'
      type: string
    }
  }
  correlations: {
    fra: number
    acoustic: number
    thermal: number
    dga: number
  }
}
```

### State Management Pattern
```typescript
// localStorage communication between components
const storeAssetData = (data) => {
  localStorage.setItem('current-asset-data', JSON.stringify({
    selectedAsset: assetId,
    transformerId: assetId,
    data: transformerData
  }))
  
  // Trigger cross-component updates
  window.dispatchEvent(new Event('storage'))
}
```

### 3D Component Mapping
```typescript
// CSV sensor data to 3D component mapping
const getComponentsFromCSV = () => {
  const csvData = getComponentData()
  return Object.keys(csvData).map((sensorId, index) => ({
    id: sensorId,
    name: csvData[sensorId].type,
    status: csvData[sensorId].status === 'anomaly' ? 'critical' : 'healthy',
    position: calculatePosition(index),
    description: `${csvData[sensorId].type}: ${csvData[sensorId].value} ${csvData[sensorId].unit}`
  }))
}
```

## 📊 Data Flow Architecture

### Cross-Page Communication
```
Data Ingestion → localStorage → AURA Analysis → localStorage → Diagnostics Dashboard
                     ↓                            ↓                     ↓
               'aura-diagnostic-data'    'aura-analysis-results'   'current-asset-data'
```

### Component Synchronization
1. **Asset Selection**: DiagnosticsDashboard updates `current-asset-data`
2. **Real-time Sync**: TransformerModel polls every 500ms for changes
3. **Event Triggering**: Manual storage events for immediate updates
4. **CSV Integration**: New transformers automatically added to asset list

## 🎨 Design System

### Color Palette
- **Electric Cyan**: `#00FFFF` - Primary accent, healthy status
- **Quantized Silver**: `#C0C0C0` - Primary text color
- **Crimson**: `#DC143C` - Critical alerts and errors
- **Amber**: `#FFA500` - Warning conditions
- **Emerald**: `#50C878` - Healthy status indicators
- **Void**: `#0a0a0a` - Background base

### UI Components
- **Glass Morphism**: Translucent panels with backdrop blur
- **Neural Backgrounds**: Animated particle systems
- **Holographic Effects**: CSS-based glow and shadow effects
- **Responsive Design**: Mobile-first approach with breakpoints

## 🚀 Execution Flow

### Development Server
```bash
npm run dev
# Starts Next.js development server on http://localhost:3000
```

### Build Process
```bash
npm run build
npm start
# Production build and deployment
```

### Demo Workflow
1. **Start Application**: Navigate to `/data-ingestion`
2. **Select Asset**: Choose transformer from Bhopal grid map
3. **Upload CSV**: Drag-and-drop diagnostic data file
4. **Configure Transformer**:
   - New: Enter custom name
   - Existing: Select from dropdown
5. **Initiate Analysis**: Click "ENGAGE AURA CORE"
6. **View Analysis**: Watch AI processing animation
7. **Review Results**: Examine verdict and recommendations
8. **Access Dashboard**: Navigate to comprehensive diagnostics
9. **Explore Digital Twin**: Interact with 3D model and components
10. **Monitor Sensors**: Review live data streams
11. **Generate Reports**: Export analysis findings

## 🔧 Configuration & Customization

### Adding New Transformers
```typescript
// In bhopalAssets array (DataIngestionPortal.tsx)
{
  id: "TX-XXX",
  name: "Transformer TX-XXX",
  location: "Your Location",
  status: "healthy" | "warning" | "critical",
  position: { x: 50, y: 50 } // Map coordinates (%)
}
```

### Modifying Analysis Logic
```typescript
// In AURAAnalysis.tsx - update demoResults
const demoResults: AnalysisResults = {
  verdict: "Your custom analysis verdict",
  severity: "low" | "moderate" | "high",
  healthScore: 0-100,
  daysToCritical: number,
  correlations: { /* correlation scores */ },
  aiInsights: "Detailed analysis description"
}
```

### 3D Model Customization
- **Model Files**: Place GLTF/GLB files in `/public/` directory
- **Component Positions**: Modify position arrays in `getComponentsFromCSV()`
- **Materials**: Update mesh materials in `TransformerModel3D` component
- **Lighting**: Adjust directional/point lights for different aesthetics

## 🐛 Troubleshooting

### Common Issues
1. **3D Model Loading**: Ensure GLTF files are in correct format and path
2. **localStorage Sync**: Clear browser storage if data becomes inconsistent
3. **Component Updates**: Check storage event listeners are properly bound
4. **Build Errors**: Verify all TypeScript types are correctly defined

### Performance Optimization
- **3D Rendering**: Use `useFrame` throttling for animations
- **State Updates**: Implement debouncing for frequent localStorage writes
- **Asset Loading**: Lazy load large 3D models and textures
- **Memory Management**: Clean up event listeners and intervals

## 📱 Browser Compatibility
- **Chrome**: Full support with optimal performance
- **Firefox**: Full support
- **Safari**: Supported with minor 3D rendering differences
- **Edge**: Full support

## 🔒 Security Considerations
- **Data Validation**: All CSV inputs are sanitized
- **XSS Prevention**: React's built-in protections
- **Local Storage**: No sensitive data stored persistently
- **File Upload**: Client-side only, no server transmission

## 📈 Future Enhancements
1. **Real-time Data Integration**: WebSocket connections for live sensor feeds
2. **Machine Learning**: Advanced anomaly detection algorithms
3. **Mobile App**: React Native companion application
4. **API Integration**: RESTful backend for data persistence
5. **Collaboration**: Multi-user diagnostic sessions
6. **Reporting**: Advanced PDF/Excel export capabilities
7. **Alerts**: Email/SMS notification system
8. **Historical Analytics**: Long-term trend analysis

## 📞 Support & Documentation
- **Development**: TypeScript with strict mode enabled
- **Testing**: Component testing with React Testing Library
- **Deployment**: Vercel/Netlify compatible
- **Monitoring**: Error boundary implementation included

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Platform**: Next.js 14 + React 18 + TypeScript  
**License**: Proprietary - GridMind AURA Initiative