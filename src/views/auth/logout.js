import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
// import { signOut } from 'store/auth-slice';
import { storageService } from 'services/storage-service';

const Logout = () => {
  // const dispatch = useDispatch();
  const router = useRouter();

  // const handleSignout = useCallback(() => {
  //   // dispatch(signOut());
  //   // navigate('/auth/login', { replace: true });

  // }, []);

  useEffect(() => {
    storageService.removeData();
    router.push('/auth/login');
  }, [router]);

  return <></>;
};

export default Logout;
