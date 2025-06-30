import { useEffect, useState } from 'react';
import { Sugar } from 'react-preloaders';

export default function LoginLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading && (
        <Sugar
          customLoading={true}
          time={1800}
          color="#ffffff"
          background="linear-gradient(137deg, rgba(47,151,211,1) 0%, rgba(43,66,117,1) 55%)"
          animation="slide"
        />
      )}
    </div>
  );
}
