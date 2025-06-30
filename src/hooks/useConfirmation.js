import PropTypes from 'prop-types';
import { createContext, useContext, useMemo, useState } from 'react';

const ConfirmationContext = createContext();

const ConfirmationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [confirmBtn, setConfirmBtn] = useState({ btnText: 'Confirm', btnColor: 'error' });

  const openConfirmation = (title, message, onConfirm, onCancel, confirmBtn) => {
    setIsOpen(true);
    setTitle(title);
    setMessage(message);
    setOnConfirm(() => onConfirm);
    setOnCancel(() => onCancel);
    setConfirmBtn(confirmBtn);
  };

  const confirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  const cancel = () => {
    setIsOpen(false);
    onCancel();
  };

  const contextValue = useMemo(
    () => ({
      isOpen,
      title,
      message,
      openConfirmation,
      confirm,
      cancel,
      confirmBtn
    }),
    [isOpen, title, message, openConfirmation, confirm, cancel, confirmBtn]
  );

  return <ConfirmationContext.Provider value={contextValue}>{children}</ConfirmationContext.Provider>;
};

const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export { ConfirmationProvider, useConfirmation };

ConfirmationProvider.propTypes = {
  children: PropTypes.node
};
