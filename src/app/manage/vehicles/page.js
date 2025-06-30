'use client';

import dynamic from 'next/dynamic';

const Vehicles = dynamic(() => import('views/vehicles/vehicles'), { ssr: false });

export default function Page() {
  return <Vehicles />;
}
