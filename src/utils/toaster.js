import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'light',
  zIndex: 999
};

const Toaster = {
  success: (message, options = defaultOptions) => {
    toast.dismiss(); // Dismiss all toasts before showing a new one
    toast.success(message, { ...defaultOptions, ...options });
  },
  info: (message, options = defaultOptions) => {
    toast.dismiss();
    toast.info(message, { ...defaultOptions, ...options });
  },
  error: (message, options = defaultOptions) => {
    toast.dismiss();
    toast.error(message, { ...defaultOptions, ...options });
  },
  warning: (message, options = defaultOptions) => {
    toast.dismiss();
    toast.warning(message, { ...defaultOptions, ...options });
  }
};

export default Toaster;
