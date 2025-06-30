import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// import { Navigate, useLocation } from 'react-router-dom';

const ProtectedGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
    }
  }, []);
  return <>{isAuthenticated && children}</>;
};

export default ProtectedGuard;

ProtectedGuard.propTypes = {
  children: PropTypes.node
};
