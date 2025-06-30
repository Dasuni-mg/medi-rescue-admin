'use client';

import dynamic from 'next/dynamic';

const OTP = dynamic(() => import('views/auth/otp'), { ssr: false });

export default function Page() {
  return <OTP />;
}
