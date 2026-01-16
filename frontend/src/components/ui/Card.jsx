export function Card({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) {
  return (
    <div
      className={`bg-white/5 rounded-lg border border-white/10 ${hover ? 'hover:bg-white/10 transition-colors' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
