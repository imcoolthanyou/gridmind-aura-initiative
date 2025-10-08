"use client"

import React from 'react'

interface MapErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error) => void
}

interface MapErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class MapErrorBoundary extends React.Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Map Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-void">
          <div className="glass-panel p-8 text-center">
            <div className="w-12 h-12 bg-crimson/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-quantized-silver mb-2">Map Loading Error</h3>
            <p className="text-sm text-quantized-silver/60 mb-4">
              The map failed to load properly. This might be a temporary issue.
            </p>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="px-4 py-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded text-sm hover:bg-electric-cyan/30 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}