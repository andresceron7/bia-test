import {useRef} from 'react';
import {Avatar, Button, Drawer, formatMillions, IconCheck, IconCircleCheck} from '../../design-system';
import {StageTrack} from './StageTrack';

export function OpportunityDrawer({opportunity, period, done, onFollowUp, onClose}) {
  // Conserva el último contenido mientras el panel anima su salida
  const last = useRef(opportunity);
  if (opportunity) last.current = opportunity;
  const o = last.current;
  if (!o) return null;

  return (
    <Drawer
      open={Boolean(opportunity)}
      eyebrow={`Oportunidad · ${period.long}`}
      title={o.company}
      onClose={onClose}
      footer={
        done ? (
          <div className="olb-done" role="status">
            <span className="olb-done__icon" aria-hidden="true">
              <IconCircleCheck size={20} strokeWidth={1.7} />
            </span>
            <div>
              <strong>Seguimiento registrado</strong>
              <span>Se conserva durante esta sesión.</span>
            </div>
            <Button variant="ghost" size="sm" autoFocus onClick={() => onFollowUp(false)}>
              Deshacer
            </Button>
          </div>
        ) : (
          <Button variant="primary" icon={IconCheck} className="olb-drawer__cta" autoFocus onClick={() => onFollowUp(true)}>
            Marcar seguimiento realizado
          </Button>
        )
      }
    >
      <div className="olb-drawer__value">
        <span className="ds-eyebrow">Valor mensual estimado</span>
        <span className="olb-drawer__amount ds-tabular">
          {formatMillions(o.value)}
          <small>COP</small>
        </span>
      </div>

      <div className="olb-drawer__block">
        <span className="ds-eyebrow">Etapa</span>
        <StageTrack stage={o.stage} showLabels />
      </div>

      <dl className="olb-drawer__grid">
        <div>
          <dt>Responsable</dt>
          <dd className="olb-drawer__owner">
            <Avatar name={o.owner} size={24} />
            {o.owner}
          </dd>
        </div>
        <div>
          <dt>Próximo contacto</dt>
          <dd>{o.nextContact} 2026</dd>
        </div>
        <div>
          <dt>Canal</dt>
          <dd>{o.channel}</dd>
        </div>
        <div>
          <dt>Periodo</dt>
          <dd>{period.long}</dd>
        </div>
      </dl>
    </Drawer>
  );
}
