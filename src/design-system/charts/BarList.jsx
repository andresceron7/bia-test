/**
 * Lista de barras horizontales.
 * Con `onSelect`, cada fila es un botón que alterna una selección (útil como filtro).
 */
export function BarList({rows, max, onSelect, activeId, valueLabel = r => r.value, leading}) {
  const top = max ?? Math.max(1, ...rows.map(r => r.value));
  const interactive = Boolean(onSelect);
  return (
    <ul className="ds-barlist" data-interactive={interactive} data-has-active={Boolean(activeId)}>
      {rows.map(row => {
        const content = (
          <>
            <span className="ds-barlist__head">
              {leading?.(row)}
              <span className="ds-barlist__label">{row.label}</span>
              {row.secondary && <span className="ds-barlist__secondary ds-tabular">{row.secondary}</span>}
              <span className="ds-barlist__value ds-tabular">{valueLabel(row)}</span>
            </span>
            <span className="ds-barlist__track" aria-hidden="true">
              <span className="ds-barlist__fill" style={{transform: `scaleX(${row.value / top})`}} />
            </span>
          </>
        );
        return (
          <li key={row.id} data-active={row.id === activeId}>
            {interactive ? (
              <button type="button" className="ds-barlist__row" aria-pressed={row.id === activeId} onClick={() => onSelect(row.id)}>
                {content}
              </button>
            ) : (
              <div className="ds-barlist__row">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
