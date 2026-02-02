# Pinterest Pin Generator

A production-ready Next.js 15 starter for a Pinterest pin generator with plan selection, usage tracking UI, and a reusable component library.

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

<UsageBar plan="PlanB" used={3} limit={5} resetLabel="in 4h 20m" />
```

### Pin Form

```tsx
import { PinForm } from "@/components/PinForm";

<PinForm />
```

## Configuration

Environment variables are stored in `.env.local` for local development. Update values as needed.

Required Replicate variables:

```
NEXT_PUBLIC_REPLICATE_API_KEY=your_replicate_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint code
