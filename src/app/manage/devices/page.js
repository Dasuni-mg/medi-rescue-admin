'use client';

import dynamic from 'next/dynamic';

const Devices = dynamic(() => import('views/devices/devices'), { ssr: false });

export default function Page() {
  return <Devices />;
}
