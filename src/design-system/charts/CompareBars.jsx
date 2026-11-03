/**
 * Comparación compacta: una barra por fila sobre la misma escala, con marca de meta opcional.
 * Pensada para contrastar el periodo actual con referencias (mes anterior, promedio…).
 */
export function CompareBars({rows, max, goal, format = v => v}) {
  const top = max ?? Math.max(goal ?? 0, ...rows.map(r => r.value), 1);
  return (
    <ul className="ds-compare">
      {rows.map(row => (
        <li key={row.id} className="ds-compare__row" data-highlight={Boolean(row.highlight)}>
          <span className="ds-compare__label">{row.label}</span>
          <span className="ds-compare__track" aria-hidden="true">
            <span className="ds-compare__fill" style={{transform: `scaleX(${Math.min(row.value / top, 1)})`}} />
            {goal !== undefined && <span className="ds-compare__goal" style={{left: `${(goal / top) * 100}%`}} />}
          </span>
          <span className="ds-compare__value ds-tabular">{format(row.value)}</span>
        </li>
      ))}
    </ul>
  );
}
