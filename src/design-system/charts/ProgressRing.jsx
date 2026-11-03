/** Anillo de progreso hacia una meta (value entre 0 y 1). */
export function ProgressRing({value, size = 144, stroke = 8, label, children}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(value, 0), 1);
  return (
    <div className="ds-ring" style={{width: size, height: size}} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ds-ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="ds-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
        />
      </svg>
      <div className="ds-ring__center" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
