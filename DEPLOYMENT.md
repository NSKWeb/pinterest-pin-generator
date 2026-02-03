# Pinterest Pin Generator - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NSKWeb/pinterest-pin-generator)

### Option 2: Manual Deployment

#### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Repository pushed to GitHub

#### Steps

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select "Import Git Repository"
   - Choose `NSKWeb/pinterest-pin-generator`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node.js Version: 18.x
   ```

4. **Add Environment Variables**
   
   Go to Settings → Environment Variables and add:

   **Required:**
   ```
   NEXT_PUBLIC_APP_NAME=PinSpark
   NEXT_PUBLIC_APP_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

   **Replicate API:**
   ```
   NEXT_PUBLIC_REPLICATE_API_KEY=r8_xxxxxxxxxxxx
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx
   ```

   **Google AdSense:**
   ```
   NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxx
   NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID=1234567890
   NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID=0987654321
   NEXT_PUBLIC_ENABLE_ADSENSE=true
   ```

   **Viads:**
   ```
   NEXT_PUBLIC_VIADS_PUBLISHER_ID=your_publisher_id
   NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID=video_placement
   NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID=interstitial_placement
   NEXT_PUBLIC_VIADS_BANNER_PLACEMENT_ID=banner_placement
   NEXT_PUBLIC_ENABLE_VIADS=true
   ```

   **Feature Flags:**
   ```
   NEXT_PUBLIC_AD_DEBUG_MODE=false
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for build
   - Visit your live URL!

---

## 🔧 Configuration Details

### Environment Variables Scope

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| App Config | ✅ | ✅ | ✅ |
| API Keys | ✅ | ✅ | ❌ |
| Ad Networks | ✅ | ✅ | ❌ |
| Debug Mode | ❌ | ✅ | ✅ |

### Security Best Practices

1. **API Keys**
   - Never commit API keys to Git
   - Use `REPLICATE_API_TOKEN` (server-side) over `NEXT_PUBLIC_REPLICATE_API_KEY`
   - Rotate keys regularly
   - Mark sensitive variables as "Sensitive" in Vercel

2. **Environment Separation**
   - Use different API keys for Production vs Preview
   - Enable debug mode only in Development/Preview
   - Test with test/sandbox ad networks first

3. **Headers & Security**
   - CSP headers configured in `next.config.js`
   - CORS protection enabled
   - XSS protection enabled
   - Clickjacking protection (X-Frame-Options)

---

## 📊 Performance Optimization

### Vercel Edge Network

- **Automatic CDN**: All static assets cached globally
- **Image Optimization**: Next.js Image component optimizes on-the-fly
- **Compression**: Gzip/Brotli enabled automatically
- **HTTP/2**: Enabled by default

### Build Optimizations

1. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for heavy components
   - Lazy loading below the fold

2. **Bundle Size**
   - Tree-shaking removes unused code
   - Production build minifies JS/CSS
   - Source maps excluded from production

3. **Caching Strategy**
   ```
   Static Assets: max-age=31536000 (1 year)
   API Routes: no-store (0 seconds)
   Pages: ISR/SSG based on need
   Images: Optimized on Edge
   ```

### Performance Monitoring

**Vercel Analytics** (Built-in)
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Performance insights
- Edge function metrics

**To Enable:**
1. Go to Project Settings → Analytics
2. Click "Enable Analytics"
3. View metrics in Analytics tab

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

**Production (main branch):**
```
git push origin main
→ Triggers production build
→ Runs tests & linting
→ Deploys to production URL
→ Updates live site
```

**Preview (feature branches):**
```
git push origin feature-branch
→ Creates preview deployment
→ Unique preview URL
→ Test before merging
→ Auto-cleanup after merge
```

**Pull Requests:**
```
Open PR → Auto preview deployment
Update PR → Re-deploy preview
Merge PR → Deploy to production
```

### Build Process

1. **Install Dependencies** (npm install)
2. **Run Linting** (npm run lint)
3. **Type Checking** (TypeScript compilation)
4. **Build** (next build)
5. **Deploy** (to Vercel Edge)

### Rollback Strategy

**If deployment fails:**
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. Instant rollback (< 30 seconds)

---

## 🌐 Custom Domain Setup

### Option A: Vercel Subdomain (Free)

Default: `pinterest-pin-generator.vercel.app`

**No configuration needed!**

### Option B: Custom Domain

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)

2. **Add to Vercel**
   - Go to Settings → Domains
   - Enter domain: `yoursite.com`
   - Click "Add"

3. **Configure DNS**

   **Option 1: Vercel Nameservers (Recommended)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option 2: A/CNAME Records**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Let's Encrypt certificate
   - Auto-renewal every 90 days
   - Free forever

5. **Propagation**
   - Wait 24-48 hours for DNS propagation
   - Check status at https://dnschecker.org

---

## 📈 Monitoring & Analytics

### 1. Vercel Analytics

**Built-in Web Analytics:**
- Page views
- Unique visitors
- Geographic distribution
- Device/browser breakdown
- Core Web Vitals

**To Access:**
- Dashboard → Analytics tab
- Real-time data
- No code changes needed

### 2. Core Web Vitals Monitoring

**Metrics Tracked:**
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅
- **TTFB** (Time to First Byte): < 600ms ✅

**Optimization Tips:**
- Use Next.js Image component
- Lazy load below-fold content
- Minimize layout shifts
- Optimize fonts

### 3. Error Tracking (Optional)

**Sentry Integration:**

1. Create account at [sentry.io](https://sentry.io)
2. Create Next.js project
3. Get DSN
4. Add to environment variables:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
   ```
5. Install SDK:
   ```bash
   npm install @sentry/nextjs
   ```
6. Run setup wizard:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

### 4. Log Monitoring

**Vercel Logs:**
- Real-time function logs
- Error tracking
- Request/response logs
- Performance metrics

**To Access:**
- Dashboard → Logs tab
- Filter by function/severity
- Export logs if needed

---

## 🔐 Security Checklist

- ✅ HTTPS enforced (auto by Vercel)
- ✅ Security headers configured
- ✅ API keys stored in environment variables
- ✅ No sensitive data in client bundle
- ✅ CORS protection enabled
- ✅ CSP headers set
- ✅ XSS protection enabled
- ✅ Clickjacking protection enabled
- ✅ Dependencies regularly updated
- ✅ Serverless functions timeout set

---

## 🐛 Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Environment variable not found"**
- Check Vercel dashboard → Settings → Environment Variables
- Ensure all required variables are set
- Redeploy after adding variables

**Error: "Build exceeded time limit"**
- Check for infinite loops in build
- Optimize large dependencies
- Contact Vercel support for limit increase

### Runtime Errors

**API Routes Timeout**
- Default: 10s (Hobby), 60s (Pro)
- Increase timeout in `vercel.json`
- Implement polling for long tasks

**Images Not Loading**
- Check `next.config.js` image domains
- Verify image URLs are accessible
- Check network tab for CORS errors

**Ads Not Showing**
- Verify environment variables
- Check ad blocker
- Review browser console
- Test with `NEXT_PUBLIC_AD_DEBUG_MODE=true`

### Performance Issues

**Slow Page Load**
- Run Lighthouse audit
- Check Core Web Vitals
- Optimize images
- Enable caching

**High Bandwidth Usage**
- Optimize images (use WebP/AVIF)
- Enable compression
- Implement lazy loading
- Use proper cache headers

---

## 📞 Support Resources

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/next.js/discussions
- Support: https://vercel.com/support

### Next.js Resources
- Documentation: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js
- Examples: https://github.com/vercel/next.js/tree/canary/examples

### Project Issues
- GitHub Issues: https://github.com/NSKWeb/pinterest-pin-generator/issues
- Discussions: https://github.com/NSKWeb/pinterest-pin-generator/discussions

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] API keys tested and working
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in browser
- [ ] All features tested
- [ ] Mobile responsive
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Security headers verified
- [ ] Analytics configured
- [ ] Error tracking setup (optional)
- [ ] Custom domain configured (optional)
- [ ] README updated with live URL

---

## 🎉 Post-Deployment Steps

1. **Test Production**
   - Visit live URL
   - Test all features
   - Check different devices
   - Verify ads load

2. **Monitor Performance**
   - Check Vercel Analytics
   - Review Core Web Vitals
   - Watch error logs

3. **Share & Promote**
   - Update README with live URL
   - Share on social media
   - Gather user feedback

4. **Continuous Improvement**
   - Monitor user behavior
   - Fix bugs promptly
   - Add requested features
   - Optimize performance

---

## 🚀 Scaling Considerations

### Vercel Plans

**Hobby (Free)**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Perfect for testing

**Pro ($20/month)**
- 1 TB bandwidth/month
- Advanced analytics
- Password protection
- Priority support
- Recommended for production

**Enterprise**
- Custom limits
- Dedicated support
- SLA guarantees
- Contact sales

### When to Upgrade

- Traffic > 100 GB/month
- Need faster builds
- Require support SLA
- Multiple team members
- Advanced security needs

---

## 📝 Deployment Summary

**Live URL:** https://pinterest-pin-generator.vercel.app

**Deployment Status:** ✅ Production Ready

**Features:**
- ✅ Serverless API routes
- ✅ Image optimization
- ✅ Automatic caching
- ✅ Global CDN
- ✅ Analytics enabled
- ✅ Error monitoring
- ✅ Auto-scaling
- ✅ SSL/TLS enabled

**Next Steps:**
1. Add custom domain (optional)
2. Configure error tracking
3. Monitor performance
4. Gather user feedback
5. Plan Phase 2 features

---

Built with ❤️ and deployed on [Vercel](https://vercel.com)
