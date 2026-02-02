# Pinterest Pin Generator

A production-ready Next.js 15 Pinterest pin generator with complete UI framework, plan selection system, and usage tracking. Built with TypeScript, Tailwind CSS 4, and React 19.

## ✨ Features

- **🎯 Plan Selection System**: Three-tier plan system (Unlimited, Limited Free, Watch & Unlock)
- **📊 Usage Tracking**: Real-time usage monitoring with daily limits and reset functionality
- **🎨 Modern UI Framework**: Reusable components with Tailwind CSS 4 and dark theme
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🔧 Type-Safe**: Full TypeScript support with proper type definitions
- **💾 State Persistence**: localStorage integration for plan and usage data
- **🚀 API Ready**: Prepared for Meta Llama and Stable Diffusion integration
- **💰 Ad Network Ready**: Google AdSense and Viads integration prepared

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home page with hero section
│   ├── globals.css                # Global styles with Tailwind
│   └── api/                       # API routes (placeholders)
│       ├── generate-ideas/         # Idea generation endpoint
│       ├── generate-prompts/       # Prompt generation endpoint
│       ├── generate-images/        # Image generation endpoint
│       └── generation-status/      # Generation status endpoint
├── components/
│   ├── Header.tsx                  # App header with plan selector
│   ├── Footer.tsx                 # App footer
│   ├── Button.tsx                 # Reusable button component
│   ├── Input.tsx                  # Form input component
│   ├── Modal.tsx                  # Modal dialog component
│   ├── Spinner.tsx                # Loading indicator
│   ├── PlanSelector.tsx            # Plan selection modal
│   ├── UsageBar.tsx               # Usage tracking bar
│   ├── PinForm.tsx                # Main generation form
│   ├── AppShell.tsx               # App layout wrapper
│   └── ads/                       # Ad network components
├── context/
│   └── PlanContext.tsx             # Plan state management
├── hooks/
│   ├── usePlanContext.ts          # Plan context hook
│   ├── useLimitCheck.ts           # Usage limit checking
│   ├── useToast.ts                # Toast notifications
│   └── useResetCountdown.ts       # Reset countdown timer
├── lib/
│   ├── config.ts                   # App configuration
│   ├── usageManager.ts            # Usage tracking logic
│   ├── planLimits.ts              # Plan limit definitions
│   ├── analytics.ts               # Analytics tracking
│   └── replicate.ts               # API integrations (placeholder)
├── types/
│   └── index.ts                    # TypeScript type definitions
├── utils/
│   ├── storage.ts                 # localStorage helpers
│   └── localStorage.ts            # Advanced storage management
└── package.json                   # Dependencies and scripts
```

## 💎 Plan System

### Plan A · Unlimited Ads
- Unlimited generations
- Heavy ad integration
- Best for high-volume creators

### Plan B · Limited Free
- 5 ideas per day
- Light ad experience
- Great for casual use

### Plan C · Watch & Unlock
- 3 free ideas daily
- Watch ads for extra credits
- Flexible for experiments

## 🎨 Component Library

### Button Component
```tsx
import { Button } from "@/components/Button";

// Multiple variants available
<Button variant="primary">Generate Ideas</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn More</Button>
```

### Input Component
```tsx
import { Input } from "@/components/Input";

<Input 
  label="Topic" 
  placeholder="Enter your topic" 
  error="Topic is required"
/>
```

### Modal Component
```tsx
import { Modal } from "@/components/Modal";

<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Select Plan">
  <div>Modal content here</div>
</Modal>
```

### Plan Selector
```tsx
import { PlanSelector } from "@/components/PlanSelector";

<PlanSelector 
  isOpen={showPlanSelector} 
  onClose={() => setShowPlanSelector(false)}
  onSelectPlan={(plan) => selectPlan(plan)}
/>
```

### Usage Bar
```tsx
import { UsageBar } from "@/components/UsageBar";

<UsageBar 
  plan={selectedPlan} 
  usage={usageStats} 
  compact={false}
/>
```

### Pin Form
```tsx
import { PinForm } from "@/components/PinForm";

// Complete form with topic, niche, and generation options
<PinForm />
```

## 🔧 Configuration

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=PinSpark

# API Keys (for future integration)
NEXT_PUBLIC_REPLICATE_API_KEY=your_api_key_here

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxx
NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID=1234567890
NEXT_PUBLIC_ENABLE_ADSENSE=true

# Viads
NEXT_PUBLIC_VIADS_PUBLISHER_ID=your_viads_publisher_id
NEXT_PUBLIC_ENABLE_VIADS=true

# Debug
NEXT_PUBLIC_AD_DEBUG_MODE=false
```

### Tailwind CSS Configuration
Custom theme with:
- Dark theme colors (indigo/blue gradient)
- Custom shadows and glows
- Responsive design utilities
- Component variants

## 📱 Features

### State Management
- React Context for plan state
- localStorage persistence
- Cross-tab synchronization
- Automatic daily reset

### Usage Tracking
- Real-time usage monitoring
- Daily limits per plan
- Reset countdown
- Usage breakdown visualization

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Accessible components

### API Integration Ready
- Meta Llama integration prepared
- Stable Diffusion API ready
- Error handling and retries
- Status tracking

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
```

## 🎯 Next Steps

The application is ready for:
1. **API Integration**: Connect Meta Llama for idea generation
2. **Image Generation**: Integrate Stable Diffusion API
3. **Ad Network Setup**: Configure Google AdSense and Viads
4. **Database Integration**: Add persistence layer
5. **User Authentication**: Add user accounts and profiles

## 📦 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - Latest React features
- **localStorage** - Client-side persistence
- **Context API** - State management

## 🔗 Integration Ready

- **Meta Llama API** - Text generation
- **Stable Diffusion** - Image generation
- **Google AdSense** - Ad monetization
- **Viads** - Video ad network

---

Built with ❤️ using Next.js 15 and modern web technologies.
