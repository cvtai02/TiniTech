import React from 'react';

export type AlertType = 'error' | 'info' | 'success';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

// Define interface for Alert component with static methods
interface AlertComponent extends React.FC<AlertProps> {
  Error: React.FC<Omit<AlertProps, 'type'>>;
  Info: React.FC<Omit<AlertProps, 'type'>>;
  Success: React.FC<Omit<AlertProps, 'type'>>;
}

const Alert: AlertComponent = ({ type, message, onClose }) => {
  const getAlertStyles = (): {
    containerClass: string;
    iconClass: string;
    icon: string;
  } => {
    switch (type) {
      case 'error':
        return {
          containerClass: 'bg-red-100 border-red-400 text-red-700',
          iconClass: 'text-red-500',
          icon: '⚠️',
        };
      case 'info':
        return {
          containerClass: 'bg-blue-100 border-blue-400 text-blue-700',
          iconClass: 'text-blue-500',
          icon: 'ℹ️',
        };
      case 'success':
        return {
          containerClass: 'bg-green-100 border-green-400 text-green-700',
          iconClass: 'text-green-500',
          icon: '✅',
        };
    }
  };

  const { containerClass, iconClass, icon } = getAlertStyles();

  return (
    <div
      className={`flex items-center p-4 mb-4 border-l-4 rounded-r ${containerClass}`}
      role="alert"
    >
      <div className={`mr-3 ${iconClass}`}>{icon}</div>
      <div>{message}</div>
      {onClose && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-opacity-25 hover:bg-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};

// Convenience static methods for different alert types
Alert.Error = (props: Omit<AlertProps, 'type'>) => (
  <Alert type="error" {...props} />
);
Alert.Info = (props: Omit<AlertProps, 'type'>) => (
  <Alert type="info" {...props} />
);
Alert.Success = (props: Omit<AlertProps, 'type'>) => (
  <Alert type="success" {...props} />
);

export default Alert;

// Usage examples:
// <Alert type="error" message="There was an error processing your request." />
// Or using convenience methods:
// <Alert.Error message="There was an error processing your request." />
// <Alert.Info message="Please note this important information." />
// <Alert.Success message="Your changes have been successfully saved." />
