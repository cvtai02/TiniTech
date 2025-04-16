import React from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';

interface AddToCartButtonProps {
  onClick?: () => void;
  size?: ButtonSize;
  content?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-3',
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onClick,
  size = 'md',
  content = 'Add to cart',
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-neutral-950 text-white rounded  transition duration-200 ${sizeClasses[size]} hover:cursor-pointer hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2`}
    >
      {content}
    </button>
  );
};

export default AddToCartButton;
