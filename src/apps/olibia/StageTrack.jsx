import {STAGES} from './model';

/** Progreso de la oportunidad en el embudo: un segmento por etapa. */
export function StageTrack({stage, showLabels = false}) {
  const current = STAGES.indexOf(stage);
  return (
    <span className="olb-track" data-labels={showLabels}>
      <span className="olb-track__bars" aria-hidden="true">
        {STAGES.map((s, i) => (
          <span key={s} className="olb-track__step" data-state={i < current ? 'past' : i === current ? 'current' : 'next'} />
        ))}
      </span>
      {showLabels ? (
        <span className="olb-track__labels">
          {STAGES.map((s, i) => (
            <span key={s} data-current={i === current} aria-current={i === current ? 'step' : undefined}>
              {s}
            </span>
          ))}
        </span>
      ) : (
        <span className="olb-track__name">
          {stage}
          <span className="sr-only">
            , etapa {current + 1} de {STAGES.length}
          </span>
        </span>
      )}
    </span>
  );
}
