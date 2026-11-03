/** Etiqueta compacta. tone: neutral | accent | success | warning | glass (translúcida) */
export function Badge({tone = 'neutral', icon: Icon, dot = false, children}) {
  return (
    <span className={`ds-badge ds-badge--${tone}`}>
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {Icon && <Icon size={12} strokeWidth={1.8} aria-hidden="true" />}
      {children}
    </span>
  );
}
