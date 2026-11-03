import {Badge, Button, Drawer, IconFact} from '../../design-system';
import {ANOMALY_START, HYPOTHESES} from './data';

/** Popup con las posibles causas del consumo nocturno, separadas del hecho medido. */
export function HypothesesDialog({open, onClose, onWhatToDo}) {
  return (
    <Drawer
      open={open}
      placement="center"
      eyebrow="Chapinero · fuera de horario"
      title="Posibles causas"
      onClose={onClose}
      footer={
        <Button variant="primary" className="bia-full" onClick={onWhatToDo}>
          Ver qué hacer
        </Button>
      }
    >
      <p className="bia-measured">
        <Badge tone="success" icon={IconFact}>
          Medido
        </Badge>
        <span>Desde el {ANOMALY_START} de octubre: ~4,5 kW extra entre 20:00 y 6:00, con la sede cerrada.</span>
      </p>
      <ol className="bia-hypotheses-list">
        {HYPOTHESES.map((h, i) => (
          <li key={h.id} className="bia-hypothesis">
            <div className="bia-hypothesis__head">
              <span className="bia-hypothesis__index ds-tabular" aria-hidden="true">
                {i + 1}
              </span>
              <strong>{h.title}</strong>
              <Badge tone={i === 0 ? 'accent' : 'neutral'}>{h.likelihood}</Badge>
            </div>
            <p className="bia-hypothesis__examples">{h.examples}</p>
            <dl>
              <div>
                <dt>Pista</dt>
                <dd>{h.clue}</dd>
              </div>
              <div>
                <dt>Cómo confirmarlo</dt>
                <dd>{h.verify}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </Drawer>
  );
}
