'use client';

import dynamic from 'next/dynamic';

const ProtectedGuard = dynamic(() => import('routes/protected-guard'), { ssr: false });
const Home = dynamic(() => import('views/home/home'), { ssr: false });

export default function Page() {
  return (
    <ProtectedGuard>
      <Home />
    </ProtectedGuard>
  );
}
