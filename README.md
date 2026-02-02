# Pinterest Pin Generator

A production-ready Next.js 15 starter for a Pinterest pin generator with plan selection, usage tracking UI, ad network integration, and a reusable component library.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
├── components/
├── context/
├── hooks/
├── lib/
├── types/
└── utils/
```

## Component Usage

### Button

```tsx
import { Button } from "@/components/Button";

<Button variant="primary">Generate</Button>
```

### Input

```tsx
import { Input } from "@/components/Input";

<Input label="Topic" placeholder="Enter a topic" />
```

### Modal

```tsx
import { Modal } from "@/components/Modal";

<Modal isOpen title="Plan" onClose={() => {}}>
  <div>Plan content</div>
</Modal>
```

### Plan Selector

```tsx
import { PlanSelector } from "@/components/PlanSelector";

<PlanSelector isOpen onClose={() => {}} />
```

### Usage Bar

```tsx
import { UsageBar } from "@/components/UsageBar";

<UsageBar
  plan="PlanB"
  ideasUsed={3}
  promptsUsed={2}
  imagesUsed={1}
  limit={5}
  resetLabel="in 4h 20m"
  onWatchAd={() => console.log("Watch ad")}
/>
```

### Ad Components

```tsx
import { AdBannerHeader, WatchAdModal, AdInterstitial } from "@/components/ads";

// Header banner (auto-displayed in Header)
<AdBannerHeader />

// Watch ad modal (for Plan C users)
<WatchAdModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onUnlock={(count) => console.log(`Unlocked ${count} generations`)}
/>

// Interstitial ad (for Plan A)
<AdInterstitial
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  autoCloseAfter={10}
/>
```

### Pin Form

```tsx
import { PinForm } from "@/components/PinForm";

<PinForm />
```

## Configuration

Environment variables are stored in `.env.local` for local development. See `.env.local.example` for a complete template.

### Replicate API

Required for image generation:

```
NEXT_PUBLIC_REPLICATE_API_KEY=your_replicate_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

### Ad Networks (Optional)

The app integrates with Google AdSense and Viads for monetization. See [AD_INTEGRATION.md](AD_INTEGRATION.md) for detailed setup instructions.

**Google AdSense:**
```
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxx
NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID=1234567890
NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID=0987654321
NEXT_PUBLIC_ENABLE_ADSENSE=true
```

**Viads:**
```
NEXT_PUBLIC_VIADS_PUBLISHER_ID=your_viads_publisher_id
NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID=placement_video_id
NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID=placement_interstitial_id
NEXT_PUBLIC_ENABLE_VIADS=true
```

**Debug Mode:**
```
NEXT_PUBLIC_AD_DEBUG_MODE=false
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint code
