// src/hooks/withPermission.js
import { hasPermission } from '../utils/permission';

const withPermission = (WrappedComponent, requiredPermission) => {
  const WithPermission = ({ children, ...props }) => {
    const hasAccess = hasPermission(requiredPermission);

    if (!hasAccess) {
      return null;
    }

    return <WrappedComponent {...props}>{children}</WrappedComponent>;
  };

  return WithPermission;
};

export default withPermission;
