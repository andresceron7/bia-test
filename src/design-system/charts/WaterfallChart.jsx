import {useLayoutEffect, useRef, useState} from 'react';

// Por debajo de este ancho, la cascada se dibuja en horizontal (una fila por paso)
const COMPACT_WIDTH = 560;

/**
 * Cascada: parte de un total, suma cada aporte y llega al total final.
 * Con `onSelect`, cada paso es un botón (aria-pressed) para explorar su explicación;
 * sin él, la cascada es de solo lectura y cada paso se anuncia como imagen con su valor.
 * `baseline` permite cortar el eje para que los aportes pequeños se lean; el corte se marca
 * visiblemente en las barras de total y en la nota del eje.
 *
 * Se adapta al ancho de su contenedor: vertical en espacios amplios, horizontal en angostos.
 *
 * steps: [{id, label, value, kind: 'total' | 'delta', emphasis?}]
 */
export function WaterfallChart({steps, format = v => v, selectedId, onSelect, height = 240, label, baseline = 0}) {
  let running = 0;
  const bars = steps.map(step => {
    if (step.kind === 'total') {
      running = step.value;
      return {...step, from: 0, to: step.value};
    }
    const from = running;
    running += step.value;
    return {...step, from, to: running};
  });
  const peak = Math.max(...bars.map(b => Math.max(b.from, b.to)));
  const top = peak + (peak - baseline) * 0.12;
  const pct = v => `${(Math.max(v - baseline, 0) / (top - baseline)) * 100}%`;
  const ref = useRef(null);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < COMPACT_WIDTH));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Paso interactivo (botón) o de solo lectura (imagen con su valor)
  const stepProps = (bar, text) =>
    onSelect
      ? {type: 'button', 'aria-pressed': bar.id === selectedId, 'aria-label': `${bar.label}: ${text}`, onClick: () => onSelect(bar.id)}
      : {role: 'img', 'aria-label': `${bar.label}: ${text}`};
  const Step = onSelect ? 'button' : 'div';
  const textOf = bar => `${bar.kind === 'delta' ? (bar.value >= 0 ? '+' : '−') : ''}${format(Math.abs(bar.value))}`;
  const axisNote = baseline > 0 && <p className="ds-waterfall__axis">Eje cortado: las barras de total inician en {format(baseline)}.</p>;

  if (compact) {
    return (
      <div ref={ref} className="ds-waterfall ds-waterfall--rows" role="group" aria-label={label}>
        {bars.map((bar, i) => {
          const low = Math.max(Math.min(bar.from, bar.to), baseline);
          const high = Math.max(bar.from, bar.to);
          return (
            <Step
              key={bar.id}
              {...stepProps(bar, textOf(bar))}
              className="ds-waterfall__row ds-waterfall__hit"
              data-kind={bar.kind}
              data-emphasis={bar.emphasis || undefined}
            >
              <span className="ds-waterfall__row-head">
                <span>{bar.label}</span>
                <span className="ds-waterfall__row-value ds-tabular">{textOf(bar)}</span>
              </span>
              <span className="ds-waterfall__row-track" aria-hidden="true">
                <span
                  className="ds-waterfall__bar"
                  data-cut={(baseline > 0 && bar.kind === 'total') || undefined}
                  style={{left: pct(low), width: `calc(${pct(high)} - ${pct(low)})`, '--delay': `${i * 80}ms`}}
                />
              </span>
            </Step>
          );
        })}
        {axisNote}
      </div>
    );
  }

  return (
    <div ref={ref} className="ds-waterfall" style={{'--chart-h': `${height}px`}} role="group" aria-label={label}>
      <div className="ds-waterfall__plot">
        {bars.map((bar, i) => {
          const low = Math.max(Math.min(bar.from, bar.to), baseline);
          const high = Math.max(bar.from, bar.to);
          const next = bars[i + 1];
          const text = textOf(bar);
          return (
            <div key={bar.id} className="ds-waterfall__col">
              <Step {...stepProps(bar, text)} className="ds-waterfall__hit" data-kind={bar.kind} data-emphasis={bar.emphasis || undefined}>
                <span
                  className="ds-waterfall__bar"
                  data-cut={(baseline > 0 && bar.kind === 'total') || undefined}
                  style={{bottom: pct(low), height: `calc(${pct(high)} - ${pct(low)})`, '--delay': `${i * 80}ms`}}
                >
                  <span className="ds-waterfall__value ds-tabular">{text}</span>
                </span>
              </Step>
              {/* Conector punteado hasta el siguiente paso */}
              {next && <span className="ds-waterfall__link" style={{bottom: pct(bar.to)}} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
      <div className="ds-waterfall__labels" aria-hidden="true">
        {bars.map(bar => (
          <span key={bar.id} data-selected={bar.id === selectedId} data-emphasis={(!onSelect && bar.emphasis) || undefined}>
            {bar.label}
          </span>
        ))}
      </div>
      {axisNote}
    </div>
  );
}
