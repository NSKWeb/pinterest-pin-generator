// Main App Entry Point

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to admin dashboard by default
  redirect('/dashboard');
}
