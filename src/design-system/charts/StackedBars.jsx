/**
 * Barras horizontales apiladas: compara totales (p. ej. meses) y su composición (p. ej. sedes).
 * La longitud de cada barra es proporcional a su total; la leyenda da el valor de cada serie.
 *
 * series: [{id, label, tone: 'accent' | 'alt' | 'muted' | 'subtle'}]
 * rows:   [{id, label, values: {[serieId]: number}, highlight?}]
 */
export function StackedBars({series, rows, format = v => v, label}) {
  const totals = rows.map(r => series.reduce((sum, s) => sum + (r.values[s.id] ?? 0), 0));
  const max = Math.max(...totals);

  return (
    <div className="ds-stacked" role="group" aria-label={label}>
      <ul className="ds-stacked__rows">
        {rows.map((row, i) => (
          <li key={row.id} className="ds-stacked__row" data-highlight={row.highlight || undefined}>
            <span className="ds-stacked__head">
              <span className="ds-stacked__label">{row.label}</span>
              <span className="ds-stacked__total ds-tabular">{format(totals[i])}</span>
            </span>
            <span
              className="ds-stacked__bar"
              style={{width: `${(totals[i] / max) * 100}%`}}
              role="img"
              aria-label={`${row.label}: ${series
                .filter(s => row.values[s.id])
                .map(s => `${s.label} ${format(row.values[s.id])}`)
                .join(', ')}`}
            >
              {series.map(s =>
                row.values[s.id] ? (
                  <span key={s.id} className="ds-stacked__segment" data-tone={s.tone} style={{flexGrow: row.values[s.id]}} />
                ) : null,
              )}
            </span>
          </li>
        ))}
      </ul>

      <table className="ds-stacked__legend">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Serie</span>
            </th>
            {rows.map(row => (
              <th key={row.id} scope="col">
                {row.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map(s => (
            <tr key={s.id}>
              <th scope="row">
                <span className="ds-stacked__swatch" data-tone={s.tone} aria-hidden="true" />
                {s.label}
              </th>
              {rows.map(row => (
                <td key={row.id} className="ds-tabular">
                  {row.values[s.id] ? format(row.values[s.id]) : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
