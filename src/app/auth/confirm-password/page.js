'use client';

import dynamic from 'next/dynamic';

const ConfirmPassword = dynamic(() => import('views/auth/confirm-password'), { ssr: false });

export default function Page() {
  return <ConfirmPassword />;
}
