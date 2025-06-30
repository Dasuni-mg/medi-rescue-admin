'use client';

import dynamic from 'next/dynamic';

const ForgortPassword = dynamic(() => import('views/auth/forgot-password'), { ssr: false });

export default function Page() {
  return <ForgortPassword />;
}
