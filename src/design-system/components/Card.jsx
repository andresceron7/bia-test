/**
 * Módulo de información flotando sobre el fondo.
 * `scope` comunica a qué datos responde el módulo (p. ej. "Según filtros").
 */
export function Card({title, eyebrow, scope, actions, children, className = '', as: Tag = 'section', ...rest}) {
  const headed = title || eyebrow || actions || scope;
  return (
    <Tag className={`ds-card ${className}`} {...rest}>
      {headed && (
        <header className="ds-card__header">
          <div className="ds-card__titles">
            {eyebrow && <span className="ds-eyebrow">{eyebrow}</span>}
            {title && <h3 className="ds-card__title">{title}</h3>}
          </div>
          <div className="ds-card__meta">
            {scope}
            {actions}
          </div>
        </header>
      )}
      {children}
    </Tag>
  );
}
