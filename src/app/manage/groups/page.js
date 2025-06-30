'use client';

import dynamic from 'next/dynamic';

const Groups = dynamic(() => import('views/groups/groups'), { ssr: false });

export default function Page() {
  return <Groups />;
}
