/**
 * URL utility for handling different deployment environments
 * Provides the correct base URL for QR codes and API calls
 */

export function getBaseURL(): string {
  // In browser environment
  if (typeof window !== 'undefined') {
    // Production (Vercel or other hosting)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.protocol}//${window.location.host}`
    }
    
    // Development - try to get network IP for mobile access
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // For development, we'll use the current URL but recommend setting NEXT_PUBLIC_BASE_URL
      const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
      if (envBaseUrl) {
        return envBaseUrl
      }
      
      // Fallback to current location (will work for desktop but not mobile)
      return `${window.location.protocol}//${window.location.host}`
    }
  }
  
  // Server-side rendering
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  // Fallback for development
  return 'http://localhost:3000'
}

export function getARViewURL(pathname: string = '/ar-view'): string {
  const baseUrl = getBaseURL()
  return `${baseUrl}${pathname}`
}

export function generateQRCodeURL(url: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
}

/**
 * Development helper to get network IP
 * This should be used in development to help users set NEXT_PUBLIC_BASE_URL
 */
export function getNetworkIPHint(): string | null {
  if (typeof window === 'undefined') return null
  
  // This is a hint for developers - they need to manually set the IP
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'Set NEXT_PUBLIC_BASE_URL=http://YOUR_IP:3000 for mobile access'
  }
  
  return null
}
