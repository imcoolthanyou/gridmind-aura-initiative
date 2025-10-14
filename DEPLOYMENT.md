# GridMind AURA Initiative - Deployment Guide

## 🚀 Vercel Deployment Instructions

### Prerequisites
- GitHub account with repository access
- Vercel account (free tier works)
- Project pushed to GitHub

### Quick Deploy Steps

#### 1. **Connect to Vercel**
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Login to Vercel
vercel login
```

#### 2. **Deploy via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Click "Deploy"

#### 3. **Environment Variables Setup**
In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
# Production URL (Vercel auto-sets this, but you can override)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Feature Flags
NEXT_PUBLIC_ENABLE_AR=true
NEXT_PUBLIC_ENABLE_3D=true
```

### 📱 AR Functionality Configuration

The AR feature requires camera permissions and works best on mobile devices:

#### Desktop Users:
- See QR code to scan with mobile device
- Automatically generates QR code with production URL

#### Mobile Users:
- Direct AR camera access
- Browser will request camera permissions
- Supports iOS Safari and Android Chrome

#### Required Headers (Already Configured):
```json
{
  "Permissions-Policy": "camera=*, gyroscope=*, accelerometer=*",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN"
}
```

### 🔧 Build Configuration

The project uses:
- **Next.js 15.3.5** with App Router
- **Turbopack** for fast development
- **SWC** for production minification
- **Dynamic imports** for SSR compatibility

### Performance Optimizations Applied:

1. **Code Splitting**
   - AR components load only on demand
   - 3D models use dynamic imports
   - Leaflet maps SSR-disabled

2. **Image Optimization**
   - AVIF/WebP formats
   - Responsive image sizes
   - Remote pattern matching

3. **Bundle Optimization**
   - Package import optimization for:
     - `@react-three/fiber` & `drei`
     - `framer-motion`
     - `lucide-react`
     - `leaflet` & `react-leaflet`

### 📊 Expected Build Output

```
Route (app)                      Size     First Load JS
┌ ○ /                         ~5 KB        ~154 KB
├ ○ /ar-view                  ~4.5 KB      ~148 KB
├ ○ /grid-command             ~7 KB        ~157 KB
├ ○ /diagnostics              ~291 KB      ~440 KB
└ ○ /training                 ~9 KB        ~156 KB
```

### 🧪 Testing Production Build Locally

```bash
# Build for production
npm run build

# Start production server
npm start

# Test on network IP for mobile AR
NEXT_PUBLIC_BASE_URL=http://YOUR_IP:3000 npm start
```

### ✅ Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Build completes without errors
- [ ] All routes load correctly
- [ ] AR QR code generates correctly on desktop
- [ ] AR camera access works on mobile
- [ ] 3D models load without SSR issues
- [ ] Maps display correctly
- [ ] No console errors in production

### 🐛 Common Issues & Solutions

#### Issue: AR camera not working
**Solution:** 
- Ensure HTTPS in production (Vercel provides this)
- Check browser permissions
- Verify headers in `vercel.json`

#### Issue: 3D models not loading
**Solution:**
- Check `/public/` directory has all GLB files
- Verify dynamic imports use `ssr: false`
- Check browser console for load errors

#### Issue: Map not rendering
**Solution:**
- Leaflet CSS loaded correctly
- Component wrapped with "use client"
- Dynamic import configured

#### Issue: Build fails with SSR error
**Solution:**
- All client-side components have `"use client"` directive
- Browser APIs wrapped in `typeof window !== 'undefined'` checks
- Dynamic imports for Three.js and Leaflet components

### 📈 Monitoring & Analytics

After deployment, monitor:
- **Vercel Analytics**: Auto-enabled for performance metrics
- **Build logs**: Check deployment logs for warnings
- **Runtime logs**: Monitor function execution
- **Browser console**: Check for client-side errors

### 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches
- **Rollback**: Previous deployments available in dashboard

### 🌐 Custom Domain Setup

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` with new domain

### 📱 Mobile AR Testing

1. Deploy to Vercel
2. Open desktop: `https://your-domain.vercel.app/ar-view`
3. Scan QR code with phone
4. Grant camera permissions
5. Test AR model overlay

### 🎯 Production Optimization Tips

1. **Reduce Bundle Size**
   ```bash
   # Analyze bundle
   npm install -g @next/bundle-analyzer
   ```

2. **Enable Caching**
   - Static assets cached automatically
   - API routes can use cache headers

3. **Performance Monitoring**
   - Use Vercel Speed Insights
   - Monitor Core Web Vitals
   - Check Lighthouse scores

### 🔐 Security Best Practices

✅ Already Implemented:
- Security headers configured
- XSS protection enabled
- Content-Type sniffing disabled
- Frame options set
- HTTPS enforced (Vercel default)

### 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment variables
4. Test locally with production build

---

**Last Updated:** 2025
**Deployment Platform:** Vercel
**Framework:** Next.js 15.3.5
