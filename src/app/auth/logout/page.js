'use client';

import dynamic from 'next/dynamic';

const Logout = dynamic(() => import('views/auth/logout'), { ssr: false });

export default function Page() {
  return <Logout />;
}
