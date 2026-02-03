# 🚀 Quick Start - Deploy to Vercel in 5 Minutes

## Step 1: Click Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NSKWeb/pinterest-pin-generator)

Click the button above to start deployment.

## Step 2: Connect GitHub

- Sign in to Vercel (or create free account)
- Connect your GitHub account
- Select the repository: `NSKWeb/pinterest-pin-generator`
- Click "Import"

## Step 3: Configure Project

**Framework:** Next.js (auto-detected)

**Build Settings:**
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x
```

Leave these as default - Vercel will detect them automatically.

## Step 4: Add Environment Variables

Click "Environment Variables" and add **MINIMUM** required variables:

### Required for Basic Functionality:
```env
NEXT_PUBLIC_APP_NAME=PinSpark
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Required for AI Generation:
Get your Replicate API key from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens):

```env
NEXT_PUBLIC_REPLICATE_API_KEY=r8_xxxxxxxxxxxxxxxxxxxx
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxx
```

### Optional - Ad Networks (can add later):
```env
NEXT_PUBLIC_ENABLE_ADSENSE=false
NEXT_PUBLIC_ENABLE_VIADS=false
NEXT_PUBLIC_AD_DEBUG_MODE=false
```

**Important:** For each variable:
- Select ✅ Production
- Select ✅ Preview
- Click "Add"

## Step 5: Deploy!

- Click "Deploy"
- Wait 2-5 minutes for build
- Your app will be live! 🎉

## Step 6: Visit Your App

After deployment:
1. Click "Visit" to see your live app
2. Copy the URL (e.g., `https://pinterest-pin-generator.vercel.app`)
3. Update `NEXT_PUBLIC_APP_URL` environment variable with your actual URL
4. Redeploy (Vercel → Deployments → ... → Redeploy)

## Step 7: Test Features

✅ Select a plan (Unlimited, Limited Free, or Watch & Unlock)
✅ Enter a topic (e.g., "Healthy Recipes")
✅ Select niche (e.g., "Food & Cooking")
✅ Click "Generate Ideas"
✅ Test image generation
✅ Download images

## 🎉 That's it!

Your Pinterest Pin Generator is now live and ready to use!

---

## Next Steps

### Add Custom Domain (Optional)
1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### Enable Analytics
1. Vercel Dashboard → Analytics
2. Click "Enable Analytics"
3. View real-time metrics

### Configure Ad Networks (Optional)
1. Get Google AdSense account
2. Get Viads publisher ID
3. Add environment variables
4. Update:
   ```env
   NEXT_PUBLIC_ENABLE_ADSENSE=true
   NEXT_PUBLIC_ENABLE_VIADS=true
   ```
5. Redeploy

### Monitor Performance
- Check Vercel Analytics for traffic
- Review Core Web Vitals
- Monitor error logs
- Optimize as needed

---

## Troubleshooting

### Build Failed?
- Check environment variables are set
- Verify Replicate API key is valid
- Review build logs in Vercel dashboard

### App Not Loading?
- Check environment variables
- Verify deployment completed successfully
- Check browser console for errors

### Features Not Working?
- Ensure Replicate API key is valid
- Check API quota/limits
- Review function logs in Vercel

### Need Help?
- 📖 [Full Deployment Guide](./DEPLOYMENT.md)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 🐛 [GitHub Issues](https://github.com/NSKWeb/pinterest-pin-generator/issues)

---

## 🎯 Performance Tips

1. **Enable Vercel Analytics** - Monitor real user metrics
2. **Use CDN** - Images served from edge network
3. **Optimize Images** - Next.js handles this automatically
4. **Monitor Logs** - Check for errors regularly
5. **Update Dependencies** - Keep packages current

---

**Happy Deploying! 🚀**

Your app is production-ready and optimized for Vercel's edge network.
