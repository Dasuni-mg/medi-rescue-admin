import { useEffect, useState } from 'react';
import { Zoom } from 'react-preloaders';

export default function InnerPageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return <div>{loading && <Zoom customLoading={true} time={1000} color={'#ffffff'} background="rgba(0,0,0,0.4)" className="" />}</div>;
}
