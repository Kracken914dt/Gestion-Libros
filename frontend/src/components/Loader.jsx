const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export default function Loader({
  label = 'Cargando...',
  size = 'md',
  inline = false,
  theme = 'dark',
  className = '',
}) {
  const spinnerSize = sizeMap[size] || sizeMap.md;
  const tone = theme === 'light' ? 'text-slate-600' : 'text-slate-200';

  return (
    <div className={`${inline ? 'inline-flex items-center gap-2' : 'flex flex-col items-center gap-3'} ${tone} ${className}`}>
      <span className={`inline-block animate-spin rounded-full border-current border-t-transparent ${spinnerSize}`} aria-hidden="true" />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </div>
  );
}