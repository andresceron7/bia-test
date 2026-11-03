import {useRef, useState} from 'react';

/**
 * Columnas verticales con línea de referencia opcional (meta, promedio…).
 * Una sola parada de tabulación: las flechas recorren las columnas (roving tabindex).
 * Cada columna muestra su valor con hover o foco; Escape oculta el tooltip (WCAG 1.4.13).
 *
 * isHighlighted(d, i): qué columnas van en acento (por defecto, la última).
 * goalLabel: texto de la línea de referencia. labelEvery: muestra una etiqueta cada N columnas.
 */
export function ColumnChart({
  data,
  goal,
  goalLabel = `Meta ${goal}`,
  highlightIndex = data.length - 1,
  isHighlighted = (_, i) => i === highlightIndex,
  showHighlightValues = true,
  labelEvery = 1,
  describe,
  step = 5,
  height = 200,
  label,
}) {
  // Eje en múltiplos de `step`, con aire sobre el valor o la referencia más alta
  const ticks = Math.ceil((Math.max(goal ?? 0, ...data.map(d => d.value)) * 1.15) / step);
  const axis = Array.from({length: ticks + 1}, (_, i) => i * step);
  const scale = v => `${(v / (step * ticks)) * 100}%`;
  const [dismissed, setDismissed] = useState(null);
  const [active, setActive] = useState(data.length - 1);
  const cols = useRef([]);

  const moveTo = i => {
    const next = Math.max(0, Math.min(data.length - 1, i));
    setActive(next);
    cols.current[next]?.focus();
  };
  const onKeyDown = (e, i) => {
    const keys = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: data.length - 1};
    if (e.key in keys) {
      e.preventDefault();
      moveTo(keys[e.key]);
    }
    if (e.key === 'Escape') setDismissed(i);
  };

  return (
    <div className="ds-columns" style={{'--chart-h': `${height}px`}} role="group" aria-label={label}>
      <div className="ds-columns__plot">
        {axis.map(t => (
          <div key={t} className="ds-columns__grid" style={{bottom: scale(t)}}>
            <span className="ds-tabular">{t}</span>
          </div>
        ))}
        {goal !== undefined && (
          <div className="ds-columns__goal" style={{bottom: scale(goal)}}>
            <span>{goalLabel}</span>
          </div>
        )}
        <div className="ds-columns__bars" data-dense={data.length > 12 || undefined}>
          {data.map((d, i) => (
            <div
              key={d.label}
              ref={el => (cols.current[i] = el)}
              className="ds-columns__col"
              data-highlight={isHighlighted(d, i)}
              data-show-value={(showHighlightValues && isHighlighted(d, i)) || undefined}
              data-dismissed={dismissed === i || undefined}
              onKeyDown={e => onKeyDown(e, i)}
              onFocus={() => setActive(i)}
              onBlur={() => setDismissed(null)}
              onPointerLeave={() => setDismissed(null)}
              tabIndex={i === active ? 0 : -1}
              role="img"
              aria-label={describe ? describe(d) : `${d.label}: ${d.value}`}
            >
              <div className="ds-columns__bar" style={{height: scale(d.value), '--delay': `${Math.min(i, 12) * 40}ms`}}>
                <span className="ds-columns__value ds-tabular">{d.value}</span>
              </div>
              {describe && (
                <span className="ds-columns__tip" aria-hidden="true">
                  {describe(d)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="ds-columns__labels" aria-hidden="true" data-dense={data.length > 12 || undefined}>
        {data.map((d, i) => (
          <span key={d.label} data-highlight={isHighlighted(d, i)}>
            {i % labelEvery === 0 ? d.label : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
