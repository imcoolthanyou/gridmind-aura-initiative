# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev --turbopack` - Start development server with Turbopack (faster builds)
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint checks

### Dependencies Management
- `npm install` - Install all dependencies
- `npm audit` - Check for security vulnerabilities

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei) with Three.js
- **Styling**: Tailwind CSS 4 with custom utility classes
- **UI Components**: Radix UI components with custom styling
- **Animations**: Framer Motion for complex animations
- **State Management**: React hooks and context

### Key Architecture Patterns

#### Page Structure
- App Router with nested layouts in `src/app/`
- Each route has a dedicated page.tsx (Overview, Data Ingestion, Diagnostics, Grid Command, Training, Technology, AR View)
- Global layout with Header component providing navigation

#### 3D Visualization System
- Canvas-based 3D scenes using React Three Fiber
- GLTF model loading with fallback to procedural geometry
- Reusable 3D components in `/components/` (3DScene.tsx, TransformerModel.tsx)
- AR capabilities with camera integration and device detection

#### Component Organization
- **Pages**: Route-specific components in `src/app/[route]/page.tsx`
- **Components**: Reusable UI components in `src/components/`
- **UI Kit**: Shadcn/ui components in `src/components/ui/`
- **Utilities**: Helper functions in `src/lib/`

#### Styling System
- Custom CSS variables for brand colors (electric-cyan, quantized-silver, void)
- Glass-panel effect utilities for consistent UI styling
- Responsive design with mobile-first approach

### Key Features

#### AR Experience (`/ar-view`)
- Device detection (desktop/mobile/tablet)
- QR code generation for cross-device experiences
- Camera permission handling
- Real-time 3D model overlay on camera feed
- Touch gesture support (pinch-to-scale, rotate)
- AR calibration and tutorial system

#### 3D Model System
- Primary models: transformer-part-2.glb, transformerjoined.glb in `/public/`
- Fallback procedural geometry when models fail to load
- Interactive controls (orbit, scale, model switching)
- Health indicators and data overlays

#### Data Integration
- CSV data parsing for sensor information (stored in localStorage)
- Dynamic component status based on data analysis
- Real-time data visualization integration

## Development Notes

### 3D Model Loading
Models are loaded from `/public/` directory. If GLTF loading fails, components automatically fallback to procedural geometry to maintain functionality.

### AR Implementation
AR features require HTTPS for camera access in production. The system handles device capabilities gracefully with appropriate fallbacks and user guidance.

### Performance Considerations
- Turbopack enabled for faster development builds
- 3D scenes use performance optimizations (frustum culling, LOD)
- AR components include performance monitoring for FPS and memory usage

### Browser Compatibility
- Modern browser features required for 3D and AR
- Progressive enhancement for older browsers
- WebXR support detection with fallbacks

## File Structure Context

```
src/
├── app/                 # Next.js App Router pages
│   ├── ar-view/        # AR experience page
│   ├── diagnostics/    # System diagnostics dashboard
│   ├── training/       # AI training interface
│   └── [other-routes]/ # Additional feature pages
├── components/         # Reusable React components
│   ├── ui/            # Shadcn/ui component library
│   ├── *3D*.tsx       # 3D visualization components
│   └── AR*.tsx        # AR-specific components
└── lib/               # Utility functions and helpers
```

### Critical Dependencies
- React Three Fiber ecosystem for 3D rendering
- Framer Motion for animations
- Radix UI for accessible components
- Tailwind CSS for styling
- Next.js 15 App Router for routing
