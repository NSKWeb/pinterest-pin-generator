# Ad Networks Integration Guide

This document explains how the ad networks (Google AdSense and Viads) are integrated into the Pinterest Pin Generator application.

## Overview

The app supports two ad networks:
- **Google AdSense**: Display ads (banners, responsive ads)
- **Viads**: Video ads and interstitial ads

Ad visibility is controlled based on the user's selected plan:
- **Plan A (Unlimited Ads)**: All ads visible, high frequency
- **Plan B (Limited Free)**: Header banner only, light ads
- **Plan C (Watch & Unlock)**: Header banner + video ads to unlock extra generations

## Setup Instructions

### 1. Google AdSense Setup

1. **Create AdSense Account**
   - Go to [https://www.google.com/adsense/](https://www.google.com/adsense/)
   - Sign up and add your website
   - Wait for approval (48-72 hours)

2. **Create Ad Units**
   - **Header Banner**: Responsive display ad (970x90px)
   - **Responsive Display**: Auto-sized display ad for sections

3. **Get Your IDs**
   - Publisher ID (format: `ca-pub-XXXXXXXXXX`)
   - Ad Unit IDs (numbers)

4. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxx
   NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID=1234567890
   NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID=0987654321
   NEXT_PUBLIC_ENABLE_ADSENSE=true
   ```

### 2. Viads Setup

1. **Create Viads Account**
   - Sign up at [https://www.viads.io/](https://www.viads.io/)
   - Add your website
   - Create ad placements

2. **Create Ad Placements**
   - **Video Ad**: Skippable video ad (5-30 seconds)
   - **Interstitial**: Full-screen between-section ad

3. **Get Your IDs**
   - Publisher ID
   - Placement IDs for video and interstitial

4. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_VIADS_PUBLISHER_ID=your_viads_publisher_id
   NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID=placement_video_id
   NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID=placement_interstitial_id
   NEXT_PUBLIC_VIADS_BANNER_PLACEMENT_ID=placement_banner_id
   NEXT_PUBLIC_ENABLE_VIADS=true
   ```

## Ad Placement Logic

### Ad Placements

| Placement ID | Network | Type | Plan A | Plan B | Plan C | Frequency |
|-------------|---------|------|--------|--------|--------|-----------|
| header-banner | AdSense | Banner | ✅ | ✅ | ✅ | Always |
| video-before-download | Viads | Video | ✅ | ✅ | ✅ | On-demand |
| interstitial-between-sections | Viads | Interstitial | ✅ | ❌ | ❌ | Per-action |

### Plan-Based Display Rules

```typescript
// Plan A: Unlimited Ads
- Header banner (always)
- Video ads before downloads (optional)
- Interstitials (every 5 generations)
- Highest frequency

// Plan B: Limited Free
- Header banner (always)
- Video ads (optional)
- No interstitials
- Minimal frequency

// Plan C: Watch & Unlock
- Header banner (always)
- Video ads to unlock extra generations
- No interstitials
- Medium frequency
```

## Components

### Ad Components

#### `AdBannerHeader`
- Location: Header component
- Network: Google AdSense
- Displays: 970x90px responsive banner
- Auto-refresh: Every 60 seconds
- Fallback: Shows placeholder if ad fails

#### `AdVideoPlayer`
- Location: Watch Ad Modal, before downloads
- Network: Viads
- Displays: Skippable video ad (30 seconds)
- Features: Countdown timer, skip after 5 seconds
- Callbacks: `onComplete(completed: boolean)`

#### `AdInterstitial`
- Location: Between sections (Plan A only)
- Network: Viads
- Displays: Full-screen overlay
- Auto-close: After 10 seconds
- Manual close: X button available

#### `WatchAdModal`
- Location: Modal triggered by "Watch Ad" button
- Network: Viads
- Purpose: Allow Plan C users to unlock extra generations
- Reward: +2 extra generations per ad watched

### Support Components

#### `AdCountdown`
- Displays circular countdown timer
- Shows skip button when available
- Format: MM:SS

#### `AdPlaceholder`
- Loading state while ad loads
- Spinner animation
- Customizable label

#### `AdFallback`
- Displayed when ad fails to load
- Shows "Ad unavailable" message
- Retry button (for video ads)

## Services

### `adManager.ts`
- Initialize AdSense and Viads SDKs
- Load ads by placement
- Handle ad loading errors
- Get ad network status

```typescript
initializeAds()           // Initialize both ad networks
loadAdSenseAd()          // Load AdSense banner
loadViadsVideo()         // Load Viads video ad
loadViadsInterstitial()  // Load Viads interstitial
getAdNetworkStatus()     // Get initialization status
```

### `adTracking.ts`
- Track ad impressions
- Track ad clicks
- Track video completion/skip
- Store events in localStorage
- Generate ad statistics

```typescript
logAdImpression()     // Log ad impression
logAdClick()          // Log ad click
logVideoWatch()       // Log video watch (completed/skipped)
getAdStats()          // Get ad statistics
getTodayVideoAdsWatched()  // Get today's video ad count
clearAdStats()        // Clear all tracking data
```

## Hooks

### `useAdConfig`
- Get ad configuration for current plan
- Check if placement should be shown
- Get placement frequency

```typescript
const {
  adSettings,           // Current plan's ad settings
  shouldShowPlacement,  // Check if placement is visible
  getBannerAdConfig,    // Get banner ad configuration
  getVideoAdConfig,     // Get video ad configuration
  getInterstitialAdConfig,  // Get interstitial configuration
} = useAdConfig(plan);
```

### `useAdUnlock`
- Manage "Watch to Unlock" functionality
- Track ad watches
- Get unlock state

```typescript
const {
  unlockState,         // Current unlock state
  watchAdToUnlock,     // Watch ad to unlock generations
  markAdWatched,       // Mark ad as watched
  getUnlockCount,      // Get unlocked generation count
  canWatchMoreAds,     // Check if can watch more ads
  isWatching,          // Currently watching ad
  watchError,          // Last error (if any)
} = useAdUnlock(plan);
```

## Usage Examples

### Display Header Banner (Automatic)
```tsx
import { AdBannerHeader } from "@/components/ads";

export const Header = () => {
  return (
    <header>
      <div>Header content...</div>
      <AdBannerHeader />
    </header>
  );
};
```

### Show Video Ad Modal (Plan C)
```tsx
import { WatchAdModal } from "@/components/ads";

export const PinForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdUnlock = (count: number) => {
    console.log(`Unlocked ${count} extra generations`);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Watch Ad for +2
      </button>
      <WatchAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUnlock={handleAdUnlock}
      />
    </>
  );
};
```

### Display Interstitial Ad (Plan A)
```tsx
import { AdInterstitial } from "@/components/ads";

export const IdeasList = () => {
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    // Show interstitial after every 5th generation
    if (generationCount % 5 === 0) {
      setShowInterstitial(true);
    }
  }, [generationCount]);

  return (
    <>
      {/* Ideas list content */}
      <AdInterstitial
        isOpen={showInterstitial}
        onClose={() => setShowInterstitial(false)}
      />
    </>
  );
};
```

## Environment Variables Reference

### Google AdSense
- `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID`: Your AdSense publisher ID
- `NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID`: Header banner ad unit ID
- `NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID`: Responsive ad unit ID
- `NEXT_PUBLIC_ENABLE_ADSENSE`: Enable/disable AdSense (true/false)

### Viads
- `NEXT_PUBLIC_VIADS_PUBLISHER_ID`: Your Viads publisher ID
- `NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID`: Video ad placement ID
- `NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID`: Interstitial placement ID
- `NEXT_PUBLIC_VIADS_BANNER_PLACEMENT_ID`: Banner placement ID
- `NEXT_PUBLIC_ENABLE_VIADS`: Enable/disable Viads (true/false)

### Debug
- `NEXT_PUBLIC_AD_DEBUG_MODE`: Enable debug logging (true/false)

## Ad Tracking & Analytics

### Events Tracked
- **Impression**: When ad loads and displays
- **Click**: When user clicks on ad
- **Complete**: When video ad is fully watched
- **Skip**: When user skips video ad
- **Error**: When ad fails to load

### Storage
- All tracking data stored in `localStorage`
- Key: `pinspark_ad_events`
- Maximum events: 1000 (auto-rotation)
- Data retention: Daily (based on timestamps)

### Statistics
```typescript
interface AdStats {
  impressions: number;        // Total impressions today
  clicks: number;             // Total clicks today
  videoWatches: number;       // Completed video watches today
  videoSkips: number;         // Skipped videos today
  byPlacement: Record<string, number>;  // By placement ID
  byNetwork: Record<AdNetwork, number>;  // By network
}
```

## Testing

### Enable Debug Mode
```env
NEXT_PUBLIC_AD_DEBUG_MODE=true
```

This will:
- Log all ad events to console
- Show ad loading status
- Display error messages

### Test Different Plans
1. Select different plans in the UI
2. Verify ad visibility matches plan rules
3. Test "Watch to Unlock" flow for Plan C

### Test Ad Failures
1. Disable ad networks:
   ```env
   NEXT_PUBLIC_ENABLE_ADSENSE=false
   NEXT_PUBLIC_ENABLE_VIADS=false
   ```
2. Verify fallback UI displays
3. Check app continues to work

## Troubleshooting

### Ads Not Displaying
1. Check environment variables are set correctly
2. Verify ad network is enabled
3. Check browser console for errors
4. Ensure you've selected a plan
5. Verify placement is enabled for your plan

### AdSense Approval Pending
1. AdSense won't show ads until approved
2. Use debug mode to verify initialization
3. Set `NEXT_PUBLIC_AD_DEBUG_MODE=true` to see logs

### Video Ads Not Playing
1. Check Viads publisher ID is correct
2. Verify placement ID is valid
3. Check browser console for SDK errors
4. Ensure pop-ups are not blocked

### localStorage Quota Exceeded
- The app automatically manages storage
- Old events are removed when quota is full
- Only last 100 events kept in emergency

## Best Practices

1. **Test Before Deploying**
   - Test with debug mode enabled
   - Verify all placements load correctly
   - Check fallback UI displays

2. **Monitor Performance**
   - Ad loading shouldn't block page load
   - Monitor ad fill rates
   - Track CTR (click-through rate)

3. **User Experience**
   - Ads should be non-intrusive
   - Always provide skip option where possible
   - Never force ads (especially Plan B)

4. **Compliance**
   - Follow Google AdSense policies
   - Follow Viads policies
   - Disclose ad presence to users
   - Don't encourage invalid clicks

## Future Enhancements

- [ ] A/B testing for ad placements
- [ ] Ad refresh optimization
- [ ] More granular frequency controls
- [ ] Backend analytics endpoint
- [ ] Ad category filtering
- [ ] Ad blocker detection
- [ ] More ad network integrations
