/**
 * Fila de un menú de opciones.
 * Con `control` (p. ej. un switch) la fila solo describe; el control es lo interactivo.
 * Con `disabled` se muestra atenuada y no recibe foco.
 */
export function MenuItem({icon: Icon, label, value, control, disabled = false, tone, onClick}) {
  const content = (
    <>
      {Icon && (
        <span className="ds-menu-item__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.6} />
        </span>
      )}
      <span className="ds-menu-item__label">{label}</span>
      {value && <span className="ds-menu-item__value">{value}</span>}
      {control}
    </>
  );
  const classes = `ds-menu-item${tone ? ` ds-menu-item--${tone}` : ''}`;
  if (control || disabled || !onClick) {
    return (
      <div className={classes} aria-disabled={disabled || undefined}>
        {content}
      </div>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}

export function MenuSection({title, children}) {
  return (
    <div className="ds-menu-section" role="group" aria-label={title}>
      {title && <span className="ds-eyebrow ds-menu-section__title">{title}</span>}
      {children}
    </div>
  );
}
