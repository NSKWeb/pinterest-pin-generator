# Vercel Setup Guide for Pinterest Pin Generator

## 🎯 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NSKWeb/pinterest-pin-generator)

---

## 📋 Environment Variables for Vercel Dashboard

Copy these to **Vercel Dashboard → Settings → Environment Variables**

### 1. Required - App Configuration

```plaintext
Variable: NEXT_PUBLIC_APP_NAME
Value: PinSpark
Environments: ✅ Production ✅ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_APP_ENV
Value: production
Environments: ✅ Production ✅ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_APP_URL
Value: https://your-project.vercel.app
Environments: ✅ Production ✅ Preview ❌ Development
Note: Update after first deployment with actual URL
```

### 2. Required - Replicate API (AI Generation)

Get your API key from: https://replicate.com/account/api-tokens

```plaintext
Variable: NEXT_PUBLIC_REPLICATE_API_KEY
Value: r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ❌ Development
```

```plaintext
Variable: REPLICATE_API_TOKEN
Value: r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ❌ Development
Sensitive: ✅ YES (Mark as sensitive)
```

### 3. Optional - Google AdSense

Get from: https://www.google.com/adsense

```plaintext
Variable: NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID
Value: ca-pub-xxxxxxxxxxxxxxxxx
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID
Value: 1234567890
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID
Value: 0987654321
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_ENABLE_ADSENSE
Value: true
Environments: ✅ Production ❌ Preview ❌ Development
```

### 4. Optional - Viads

```plaintext
Variable: NEXT_PUBLIC_VIADS_PUBLISHER_ID
Value: your_viads_publisher_id
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID
Value: placement_video_id
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID
Value: placement_interstitial_id
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_VIADS_BANNER_PLACEMENT_ID
Value: placement_banner_id
Environments: ✅ Production ❌ Preview ❌ Development
```

```plaintext
Variable: NEXT_PUBLIC_ENABLE_VIADS
Value: true
Environments: ✅ Production ❌ Preview ❌ Development
```

### 5. Feature Flags

```plaintext
Variable: NEXT_PUBLIC_AD_DEBUG_MODE
Value: false
Environments: ✅ Production ❌ Preview ❌ Development
```

---

## 🔧 Build Configuration

These are auto-detected by Vercel, but verify they match:

```yaml
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node.js Version: 18.x
```

---

## 📊 Serverless Function Settings

In `vercel.json` (already configured):

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

**Note:** 60 seconds is the maximum for Hobby plan. Pro plan allows up to 300 seconds.

---

## 🌐 Domain Setup

### Default Vercel Domain
- Automatically provided: `your-project.vercel.app`
- Free SSL certificate
- No configuration needed

### Custom Domain (Optional)

1. **Add Domain in Vercel:**
   - Go to Settings → Domains
   - Click "Add"
   - Enter your domain: `yourdomain.com`

2. **Configure DNS:**

   **Option A: Vercel Nameservers (Recommended)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B: A/CNAME Records**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate:**
   - Automatically provisioned by Vercel
   - Free via Let's Encrypt
   - Auto-renewal

---

## 🚀 Deployment Settings

### Auto-Deployment

1. **Production Branch:**
   - Settings → Git → Production Branch
   - Set to: `main`
   - ✅ Enable "Automatically deploy when push to production branch"

2. **Preview Deployments:**
   - ✅ Enable "Deploy previews for all branches"
   - ✅ Enable "Deploy previews for pull requests"

### Branch Protection

Recommended GitHub branch protection rules for `main`:
- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ❌ Allow force pushes (keep disabled)

---

## 📈 Analytics Setup

### Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics" tab
3. Click "Enable Analytics"
4. Free tier includes:
   - Page views
   - Unique visitors
   - Core Web Vitals
   - Geographic data

### Speed Insights

1. Go to "Speed Insights" tab
2. Click "Enable Speed Insights"
3. Monitor:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## 🔒 Security Settings

### Environment Variable Security

Mark these as "Sensitive" in Vercel:
- ✅ `REPLICATE_API_TOKEN`
- ✅ Any API keys with write permissions
- ✅ Any authentication secrets

### Headers (Already Configured)

Security headers are set in `next.config.js`:
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Strict-Transport-Security`
- ✅ `Referrer-Policy`
- ✅ `Permissions-Policy`

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
1. All environment variables are set
2. Build command is correct: `npm run build`
3. Node.js version is 18.x or higher
4. Dependencies installed correctly

**View Logs:**
- Vercel Dashboard → Deployments → Click deployment → View logs

### Runtime Errors

**Check:**
1. Environment variables in production
2. API keys are valid
3. Function timeout settings
4. CORS configuration

**View Logs:**
- Vercel Dashboard → Logs → Filter by severity

### Performance Issues

**Check:**
1. Image optimization enabled
2. Caching headers configured
3. CDN serving static assets
4. Core Web Vitals in Analytics

**Monitor:**
- Vercel Analytics → Speed Insights
- Check bundle size in build logs

---

## 📞 Support

### Vercel Support
- Dashboard → Help → Contact Support
- Community: https://github.com/vercel/next.js/discussions
- Docs: https://vercel.com/docs

### Project Issues
- GitHub: https://github.com/NSKWeb/pinterest-pin-generator/issues
- Documentation: See DEPLOYMENT.md

---

## ✅ Post-Deployment Checklist

After deployment completes:

- [ ] Visit live URL and test
- [ ] Verify environment variables
- [ ] Test plan selection
- [ ] Test idea generation (requires API key)
- [ ] Test image generation (requires API key)
- [ ] Check ads load (if enabled)
- [ ] Test on mobile device
- [ ] Check Core Web Vitals
- [ ] Enable Analytics
- [ ] Update `NEXT_PUBLIC_APP_URL` with actual URL
- [ ] Redeploy after URL update

---

## 🎉 Success!

Your Pinterest Pin Generator is now live on Vercel!

**Next Steps:**
1. Test all features
2. Monitor performance
3. Share with users
4. Gather feedback
5. Iterate and improve

---

**Deployment Time:** ~5 minutes
**Difficulty:** Easy
**Cost:** Free (Hobby plan) or $20/month (Pro plan)

---

Last Updated: February 2026
