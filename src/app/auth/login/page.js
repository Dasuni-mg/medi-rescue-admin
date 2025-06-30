'use client';

import dynamic from 'next/dynamic';

const AuthLogin = dynamic(() => import('views/auth/login'), { ssr: false });

export default function Page() {
  return <AuthLogin />;
}
