import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  style,
  className,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? '#ccc' : '#007BFF',
        color: '#fff',
        ...style,
      }}
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
