# Mobile AR Development Setup

This guide explains how to set up your development environment for mobile AR access across different deployment scenarios.

## Quick Setup

### For Development (Mobile Access)

1. **Auto-configure your network IP:**
   ```bash
   npm run setup:mobile
   ```
   
2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access on mobile:**
   - Make sure your phone is on the same WiFi network
   - Visit `/ar-view` on your desktop browser
   - Scan the QR code with your mobile device

### Manual Setup

If the auto-configuration doesn't work, follow these steps:

1. **Find your machine's IP address:**
   - **Windows:** Open Command Prompt and run `ipconfig`
   - **Mac/Linux:** Open Terminal and run `ifconfig`
   - Look for your WiFi adapter's IPv4 address (usually starts with `192.168.x.x`)

2. **Set the environment variable:**
   Create or edit `.env.local` in your project root:
   ```env
   NEXT_PUBLIC_BASE_URL=http://YOUR_IP_ADDRESS:3000
   ```
   
   Example:
   ```env
   NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3000
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## How It Works

### Environment Detection

The application automatically detects its environment and generates appropriate URLs:

- **Development (localhost):** Uses `NEXT_PUBLIC_BASE_URL` if set, otherwise falls back to localhost
- **Production (Vercel):** Automatically uses the production domain
- **Custom hosting:** Uses `VERCEL_URL` or `NEXT_PUBLIC_BASE_URL`

### QR Code Generation

- QR codes are generated with environment-appropriate URLs
- In development, they use your network IP for mobile access
- In production, they use your domain name
- Always accessible across devices on the same network

## Deployment

### Vercel Deployment

No additional configuration needed! The app automatically detects Vercel's environment and uses the correct URLs.

### Other Hosting Providers

Set the `NEXT_PUBLIC_BASE_URL` environment variable to your domain:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Troubleshooting

### QR Code Shows "Connection Refused"

1. **Check your network connection:** Ensure both devices are on the same WiFi network
2. **Verify the IP address:** Run `npm run setup:mobile` to auto-detect your current IP
3. **Check firewall settings:** Make sure port 3000 is not blocked by your firewall
4. **Restart the dev server:** After changing `.env.local`, restart with `npm run dev`

### Mobile Device Can't Access the Site

1. **Confirm IP address:** Double-check your machine's IP address hasn't changed
2. **Test direct access:** Try visiting `http://YOUR_IP:3000` directly on your phone
3. **Check router settings:** Some routers block device-to-device communication
4. **Try mobile hotspot:** Connect your computer to your phone's hotspot as a test

### Development vs Production Issues

- **Development:** Uses IP addresses for local network access
- **Production:** Uses domain names for public access
- **Mixed environments:** Make sure `NEXT_PUBLIC_BASE_URL` is set correctly

## Advanced Configuration

### Custom Port

If you're using a different port:

```env
NEXT_PUBLIC_BASE_URL=http://192.168.1.100:3001
PORT=3001
```

### Network Interface Selection

The auto-detection script picks the first available network interface. If you have multiple network adapters, you may need to manually set the IP address.

### Security Considerations

- The `.env.local` file is ignored by git for security
- Only set `NEXT_PUBLIC_BASE_URL` in production if needed
- Use HTTPS in production for secure camera access

## File Structure

```
├── .env.example          # Example environment configuration
├── .env.local           # Your local development settings (git-ignored)
├── scripts/
│   └── setup-mobile-dev.js  # Auto IP detection script
├── src/lib/utils/
│   └── url.ts           # URL utilities for environment detection
└── docs/
    └── MOBILE_AR_SETUP.md   # This documentation
```

## Support

If you encounter issues:

1. Check this documentation first
2. Run `npm run setup:mobile` to auto-configure
3. Verify network connectivity between devices
4. Check browser console for error messages
5. Ensure camera permissions are granted on mobile devices

The AR experience requires:
- HTTPS (in production) or localhost (in development)
- Camera permissions
- Modern browser with WebRTC support
- Stable network connection
