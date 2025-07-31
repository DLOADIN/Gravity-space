# Vercel Deployment Guide - Art Space Frontend

## Overview

This guide will help you deploy your React art space application to Vercel with optimal performance and security configurations.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Your code should be in a Git repository
3. **Node.js**: Version 16 or higher (Vercel will handle this automatically)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository has the following files:
- `package.json` (with build script)
- `vercel.json` (configuration file)
- `vite.config.ts` (Vite configuration)
- `.gitignore` (to exclude node_modules, dist, etc.)

### 2. Connect to Vercel

1. **Import Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (if your frontend is in the root)
   - **Build Command**: `npm run build` (or `yarn build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (or `yarn install`)

### 3. Environment Variables

Set these environment variables in your Vercel project settings:

```bash
# API Configuration
VITE_API_BASE_URL=https://ruwaga1231.pythonanywhere.com

# Optional: Analytics and Monitoring
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### 4. Deploy

1. **Automatic Deployment**: Vercel will automatically deploy when you push to your main branch
2. **Manual Deployment**: You can also deploy manually from the Vercel dashboard

## Configuration Details

### vercel.json Breakdown

The `vercel.json` file includes:

#### 1. **Build Configuration**
```json
"builds": [
  {
    "src": "package.json",
    "use": "@vercel/static-build",
    "config": {
      "distDir": "dist"
    }
  }
]
```

#### 2. **Routing Rules**
- **Static Assets**: Proper caching for JS, CSS, images
- **SPA Routing**: All routes redirect to `index.html` for React Router
- **API Routes**: Reserved for future API endpoints

#### 3. **Security Headers**
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Basic XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

#### 4. **Caching Strategy**
- **Assets**: Long-term caching (1 year) with immutable flag
- **Static Files**: Medium-term caching (1 day) with stale-while-revalidate
- **HTML/JSON**: No caching to ensure fresh content

## Custom Domains

### 1. Add Custom Domain
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., `artspace.com`)

### 2. Update CORS Configuration
After getting your custom domain, update the CORS configuration in your Flask backend:

```python
CORS(app, 
     origins=['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 
              'https://ruwaga1231.pythonanywhere.com', 
              'https://your-custom-domain.vercel.app',  # Your Vercel domain
              'https://your-custom-domain.com'],        # Your custom domain
     supports_credentials=True)
```

## Performance Optimization

### 1. **Build Optimization**
- Vite automatically optimizes your build
- Code splitting is enabled
- Assets are hashed for cache busting

### 2. **CDN Benefits**
- Vercel's global CDN ensures fast loading worldwide
- Automatic compression (gzip/brotli)
- Edge caching for optimal performance

### 3. **Image Optimization**
Consider using Vercel's Image Optimization:
```jsx
import Image from 'next/image' // If using Next.js
// Or use Vercel's Image Optimization API
```

## Monitoring and Analytics

### 1. **Vercel Analytics**
- Enable Vercel Analytics in your project settings
- Track Core Web Vitals
- Monitor performance metrics

### 2. **Error Tracking**
Consider adding error tracking:
```bash
npm install @sentry/react @sentry/tracing
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check your build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Routing Issues**:
   - Ensure all routes are covered in `vercel.json` rewrites
   - Check that React Router is configured correctly

3. **API Connection Issues**:
   - Verify your API base URL is correct
   - Check CORS configuration on your backend
   - Ensure environment variables are set

4. **Authentication Issues**:
   - Verify JWT tokens are being sent correctly
   - Check that your backend accepts the Authorization header
   - Ensure CORS allows credentials

### Debug Commands

```bash
# Test build locally
npm run build

# Test production build
npm run preview

# Check for TypeScript errors
npx tsc --noEmit
```

## Post-Deployment Checklist

- [ ] Verify all routes work correctly
- [ ] Test authentication flow
- [ ] Check API connections
- [ ] Validate image loading
- [ ] Test responsive design
- [ ] Verify performance metrics
- [ ] Set up monitoring/analytics
- [ ] Configure custom domain (if needed)
- [ ] Update CORS settings on backend
- [ ] Test on different devices/browsers

## Advanced Features

### 1. **Preview Deployments**
- Every PR gets a preview deployment
- Test changes before merging to main

### 2. **Environment Variables**
- Different variables for production/staging
- Secure storage of sensitive data

### 3. **Edge Functions**
- Serverless functions for API routes
- Global edge deployment

### 4. **Automatic HTTPS**
- SSL certificates are automatically provisioned
- HTTP/2 and HTTP/3 support

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status Page**: [vercel-status.com](https://vercel-status.com)

## Next Steps

After successful deployment:

1. **Set up monitoring** for performance and errors
2. **Configure analytics** to track user behavior
3. **Set up CI/CD** for automated testing
4. **Implement SEO** optimizations
5. **Add PWA features** for mobile experience 