'use client';

import dynamic from 'next/dynamic';

const Incidents = dynamic(() => import('views/incidents/incidents'), { ssr: false });

export default function Page() {
  return <Incidents />;
}
