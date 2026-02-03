# Deployment Checklist

## Pre-Deployment

### Code Quality
- [x] All TypeScript types defined
- [x] No console.log in production code (auto-removed)
- [x] No hardcoded secrets/API keys
- [x] All linting rules pass
- [x] Build succeeds with no errors (`npm run build`)

### Configuration Files
- [x] `next.config.js` optimized for production
- [x] `vercel.json` configured
- [x] `.env.local.example` updated with all variables
- [x] `.gitignore` includes sensitive files
- [x] `.vercelignore` configured
- [x] `robots.txt` created

### Documentation
- [x] README.md updated with deployment instructions
- [x] DEPLOYMENT.md created with detailed guide
- [x] Environment variables documented
- [x] API routes documented

## Vercel Setup

### Account & Project
- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project imported and configured
- [ ] Project name set to "pinterest-pin-generator"
- [ ] Framework preset: Next.js
- [ ] Build settings verified

### Environment Variables
Add the following in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables
- [ ] `NEXT_PUBLIC_APP_NAME=PinSpark`
- [ ] `NEXT_PUBLIC_APP_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL=https://your-project.vercel.app`

#### Replicate API
- [ ] `NEXT_PUBLIC_REPLICATE_API_KEY=r8_...` (get from replicate.com)
- [ ] `REPLICATE_API_TOKEN=r8_...` (server-side only, mark as "Sensitive")

#### Google AdSense
- [ ] `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-...`
- [ ] `NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID=...`
- [ ] `NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID=...`
- [ ] `NEXT_PUBLIC_ENABLE_ADSENSE=true`

#### Viads
- [ ] `NEXT_PUBLIC_VIADS_PUBLISHER_ID=...`
- [ ] `NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID=...`
- [ ] `NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID=...`
- [ ] `NEXT_PUBLIC_VIADS_BANNER_PLACEMENT_ID=...`
- [ ] `NEXT_PUBLIC_ENABLE_VIADS=true`

#### Feature Flags
- [ ] `NEXT_PUBLIC_AD_DEBUG_MODE=false`

### Build Configuration
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Node.js Version: 18.x

## Deployment

### Initial Deployment
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check build logs for errors
- [ ] Note the deployment URL

### Auto-Deployment Setup
- [ ] Enable auto-deploy on push to main
- [ ] Enable preview deployments for PRs
- [ ] Configure production branch: "main"

## Post-Deployment Testing

### Functionality Tests
- [ ] Visit app URL
- [ ] Plan selection works
- [ ] Generate pin ideas (test with Replicate API)
- [ ] Generate prompts
- [ ] Generate images
- [ ] Download images
- [ ] Usage limits work correctly
- [ ] Daily reset countdown works

### Ad Network Tests
- [ ] Google AdSense loads (if enabled)
- [ ] Viads loads (if enabled)
- [ ] Ad placements visible
- [ ] No console errors related to ads

### Performance Tests
- [ ] Run Lighthouse audit (score > 90)
- [ ] Check Core Web Vitals:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Test on mobile device
- [ ] Test on slow 4G network
- [ ] Verify image optimization

### Security Tests
- [ ] HTTPS enforced
- [ ] Security headers present (check DevTools)
- [ ] No API keys visible in client bundle
- [ ] CORS working correctly
- [ ] API routes protected

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Monitoring Setup

### Vercel Analytics
- [ ] Enable Web Analytics in Vercel dashboard
- [ ] Verify analytics tracking
- [ ] Check Core Web Vitals dashboard

### Error Tracking (Optional)
- [ ] Sentry account created
- [ ] Sentry DSN added to environment variables
- [ ] Error tracking initialized
- [ ] Test error reporting

### Logging
- [ ] Review Vercel function logs
- [ ] Check for runtime errors
- [ ] Verify API endpoint logs

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased
- [ ] DNS configured
- [ ] Domain added in Vercel
- [ ] SSL certificate provisioned
- [ ] Domain verified and working

### Advanced Analytics
- [ ] Google Analytics setup
- [ ] Plausible Analytics setup
- [ ] Custom event tracking

### Performance Optimization
- [ ] Image optimization verified
- [ ] CDN caching working
- [ ] Bundle size optimized
- [ ] Code splitting effective

## Launch

### Final Checks
- [ ] All features tested and working
- [ ] No critical errors in logs
- [ ] Performance metrics acceptable
- [ ] Mobile responsive
- [ ] Security headers verified
- [ ] Environment variables secured

### Documentation
- [ ] README.md updated with live URL
- [ ] API documentation complete
- [ ] User guide created (if needed)
- [ ] Changelog started

### Communication
- [ ] Team notified of deployment
- [ ] Beta testers invited
- [ ] Social media announcement (optional)
- [ ] Landing page updated with link

## Rollback Plan

### If Issues Occur
- [ ] Know how to access Vercel dashboard
- [ ] Know how to find previous deployments
- [ ] Know how to promote previous deployment
- [ ] Have emergency contact for support

### Rollback Steps
1. Go to Vercel Dashboard → Deployments
2. Find last successful deployment
3. Click "..." → "Promote to Production"
4. Verify rollback successful
5. Investigate and fix issue
6. Redeploy when fixed

## Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor performance metrics
- [ ] Review user feedback

### Weekly
- [ ] Check Core Web Vitals trends
- [ ] Review analytics data
- [ ] Update dependencies (if needed)

### Monthly
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Feature prioritization
- [ ] User feedback analysis

## Success Criteria

- [x] App builds successfully
- [ ] App deploys to Vercel
- [ ] Live URL accessible
- [ ] All features work in production
- [ ] Performance metrics pass
- [ ] No critical errors
- [ ] Security headers configured
- [ ] Monitoring enabled

## Notes

**Deployment URL:** _To be filled after deployment_

**Deployment Date:** _To be filled_

**Deployed By:** _To be filled_

**API Keys Status:**
- Replicate API: _Configured/Pending_
- Google AdSense: _Configured/Pending_
- Viads: _Configured/Pending_

**Known Issues:** _None currently_

**Next Steps:**
1. Deploy to Vercel
2. Configure environment variables
3. Test all features
4. Enable analytics
5. Monitor performance

---

**Status:** ✅ Ready for Deployment

All pre-deployment requirements met. Proceed with Vercel deployment.
