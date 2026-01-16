export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) {
  const variants = {
    primary: "bg-white hover:bg-gray-200 text-black font-bold",
    outline: "border border-white/30 hover:border-white text-white bg-transparent hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`rounded-full transition-all font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
