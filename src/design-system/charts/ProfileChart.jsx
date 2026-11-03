import {useId, useState} from 'react';

const hourLabel = h => `${String(h).padStart(2, '0')}:00`;

/** ¿La hora h cae dentro de una franja que puede cruzar la medianoche? */
const inBand = (h, {from, to}) => (from <= to ? h >= from && h < to : h >= from || h < to);

/**
 * Perfil de 24 horas: compara series (p. ej. antes y después) y sombrea franjas horarias.
 * Hover o flechas del teclado recorren las horas; la lectura se anuncia en una región viva.
 *
 * series: [{id, label, values: number[24], tone: 'accent' | 'muted'}]
 * bands:  [{from, to, label}] — horas 0–23; `to` es exclusivo y puede ser menor que `from`
 */
export function ProfileChart({series, bands = [], unit = 'kW', step = 2, height = 240, label, format = v => v}) {
  const id = useId();
  const [active, setActive] = useState(null);
  const max = Math.max(...series.flatMap(s => s.values));
  const ticks = Math.ceil((max * 1.15) / step);
  const top = ticks * step;
  const x = h => (h / 23) * 100;
  const y = v => 100 - (v / top) * 100;
  const path = values => values.map((v, h) => `${h ? 'L' : 'M'}${x(h)},${y(v)}`).join(' ');

  const describe = h => {
    const band = bands.find(b => inBand(h, b));
    const readings = series.map(s => `${s.label} ${format(s.values[h])} ${unit}`).join(' · ');
    return `${hourLabel(h)}${band ? ` (${band.label.toLowerCase()})` : ''}: ${readings}`;
  };

  const onPointerMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActive(Math.round(((e.clientX - rect.left) / rect.width) * 23));
  };
  const onKeyDown = e => {
    const current = active ?? 0;
    const keys = {ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: 23};
    if (e.key in keys) {
      e.preventDefault();
      setActive(Math.max(0, Math.min(23, keys[e.key])));
    }
    if (e.key === 'Escape') setActive(null);
  };

  return (
    <div className="ds-profile">
      <ul className="ds-profile__legend">
        {series.map(s => (
          <li key={s.id} data-tone={s.tone}>
            <span aria-hidden="true" />
            {s.label}
          </li>
        ))}
        {bands.map(b => (
          <li key={b.label} data-tone="band">
            <span aria-hidden="true" />
            {b.label}
          </li>
        ))}
      </ul>

      <div className="ds-profile__frame">
        <div className="ds-profile__axis" aria-hidden="true">
          {Array.from({length: ticks + 1}, (_, i) => (
            <span key={i} className="ds-tabular" style={{top: `${y(i * step)}%`}}>
              {i * step}
            </span>
          ))}
        </div>

        <div
          className="ds-profile__plot"
          style={{height}}
          tabIndex={0}
          role="group"
          aria-label={`${label}. Usa las flechas para recorrer las horas.`}
          aria-describedby={`${id}-reading`}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(a => a ?? 22)}
          onBlur={() => setActive(null)}
          onKeyDown={onKeyDown}
        >
          {bands.flatMap(b =>
            (b.from <= b.to
              ? [[b.from, b.to]]
              : [
                  [b.from, 24],
                  [0, b.to],
                ]
            ).map(([from, to]) => (
              <span
                key={`${b.label}-${from}`}
                className="ds-profile__band"
                style={{left: `${(from / 24) * 100}%`, width: `${((to - from) / 24) * 100}%`}}
                aria-hidden="true"
              />
            )),
          )}
          {Array.from({length: ticks + 1}, (_, i) => (
            <span key={i} className="ds-profile__grid" style={{top: `${y(i * step)}%`}} aria-hidden="true" />
          ))}

          <svg className="ds-profile__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {series.map(s => (
              <g key={s.id} data-tone={s.tone}>
                {s.tone === 'accent' && <path className="ds-profile__area" d={`${path(s.values)} L100,100 L0,100 Z`} />}
                <path className="ds-profile__line" d={path(s.values)} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
          </svg>

          {active !== null && (
            <>
              <span className="ds-profile__cursor" style={{left: `${x(active)}%`}} aria-hidden="true" />
              {series.map(s => (
                <span
                  key={s.id}
                  className="ds-profile__dot"
                  data-tone={s.tone}
                  style={{left: `${x(active)}%`, top: `${y(s.values[active])}%`}}
                  aria-hidden="true"
                />
              ))}
              <div
                className="ds-profile__tip"
                data-side={active > 15 ? 'left' : 'right'}
                style={{left: `${x(active)}%`}}
                aria-hidden="true"
              >
                <strong>{hourLabel(active)}</strong>
                {series.map(s => (
                  <span key={s.id} data-tone={s.tone}>
                    {s.label}
                    <b className="ds-tabular">
                      {format(s.values[active])} {unit}
                    </b>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="ds-profile__hours" aria-hidden="true">
        {[0, 3, 6, 9, 12, 15, 18, 21].map(h => (
          <span key={h} style={{left: `${x(h)}%`}}>
            {hourLabel(h)}
          </span>
        ))}
      </div>
      <p id={`${id}-reading`} className="sr-only" aria-live="polite">
        {active !== null ? describe(active) : ''}
      </p>
    </div>
  );
}
