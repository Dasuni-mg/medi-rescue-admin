'use client';

import dynamic from 'next/dynamic';

const Organizations = dynamic(() => import('views/organizations/organizations'), { ssr: false });

export default function Page() {
  return <Organizations />;
}
