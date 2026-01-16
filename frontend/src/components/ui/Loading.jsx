export function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
    </div>
  );
}
