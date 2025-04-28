// src/components/common/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`${sizeClasses[size]} border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
