import {IconTrendDown, IconTrendUp} from '../icons';

/**
 * Métrica protagonista: número grande y ligero, etiqueta corta y contexto.
 * delta: número con signo para indicar la tendencia.
 */
export function Stat({label, value, unit, delta, deltaLabel, caption, size = 'md'}) {
  const up = delta > 0;
  const TrendIcon = up ? IconTrendUp : IconTrendDown;
  return (
    <div className={`ds-stat ds-stat--${size}`}>
      <span className="ds-eyebrow">{label}</span>
      <div className="ds-stat__value ds-tabular">
        {value}
        {unit && <span className="ds-stat__unit">{unit}</span>}
      </div>
      {(delta !== undefined || caption) && (
        <div className="ds-stat__foot">
          {delta !== undefined && delta !== 0 && (
            <span className={`ds-stat__delta ds-stat__delta--${up ? 'up' : 'down'}`}>
              <TrendIcon size={16} strokeWidth={1.8} aria-hidden="true" />
              {deltaLabel}
            </span>
          )}
          {caption && <span className="ds-stat__caption">{caption}</span>}
        </div>
      )}
    </div>
  );
}
