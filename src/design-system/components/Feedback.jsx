import {initials} from '../format';

/** Bloque de carga con brillo animado. */
export function Skeleton({width = '100%', height = 16, radius}) {
  return <span className="ds-skeleton" style={{width, height, borderRadius: radius}} aria-hidden="true" />;
}

/** Estado vacío con mensaje y acción para salir de él. */
export function EmptyState({icon: Icon, title, description, action}) {
  return (
    <div className="ds-empty">
      {Icon && (
        <span className="ds-empty__icon" aria-hidden="true">
          <Icon size={24} strokeWidth={1.5} />
        </span>
      )}
      <p className="ds-empty__title">{title}</p>
      {description && <p className="ds-empty__description">{description}</p>}
      {action}
    </div>
  );
}

/** Iniciales en un círculo; el color se deriva del nombre para ser estable. */
export function Avatar({name, size = 32}) {
  const hue = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 4;
  return (
    <span className={`ds-avatar ds-avatar--${hue}`} style={{'--size': `${size}px`}} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
