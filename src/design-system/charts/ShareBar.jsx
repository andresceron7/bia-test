import {formatPercent} from '../format';

/**
 * Barra de composición al 100% con leyenda interactiva.
 * La leyenda es la vía accesible: cada entrada es un botón con su número y porcentaje.
 */
export function ShareBar({segments, onSelect, activeId, unit = ''}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div className="ds-share" data-has-active={Boolean(activeId)}>
      <div className="ds-share__bar" aria-hidden="true">
        {total === 0 ? (
          <span className="ds-share__empty" />
        ) : (
          segments.map((s, i) => (
            <span key={s.id} className="ds-share__segment" data-tone={i} data-active={s.id === activeId} style={{flexGrow: s.value}} />
          ))
        )}
      </div>
      <ul className="ds-share__legend">
        {segments.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="ds-share__item"
              data-active={s.id === activeId}
              aria-pressed={onSelect ? s.id === activeId : undefined}
              disabled={!onSelect}
              onClick={() => onSelect?.(s.id)}
            >
              <span className="ds-share__swatch" data-tone={i} aria-hidden="true" />
              <span className="ds-share__label">{s.label}</span>
              <span className="ds-share__value ds-tabular">
                {s.value}
                {unit}
              </span>
              <span className="ds-share__pct ds-tabular">{total ? formatPercent((s.value / total) * 100) : '—'}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
