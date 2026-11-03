import {Button, IconArrowRight, IconClose, IconFlag} from '../../design-system';

export function Banner({onAction, onClose}) {
  return (
    <section className="olb-banner" aria-label="Aviso comercial">
      <span className="olb-banner__icon" aria-hidden="true">
        <IconFlag size={20} strokeWidth={1.6} />
      </span>
      <p>
        <strong>Recta final del mes.</strong> Revisa las oportunidades abiertas y coordina los próximos contactos con tu equipo.
      </p>
      <Button variant="primary" size="sm" onClick={onAction}>
        Ver negociaciones
        <IconArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
      </Button>
      <Button variant="ghost" size="sm" icon={IconClose} iconOnly label="Cerrar aviso" tooltipSide="top-end" onClick={onClose} />
    </section>
  );
}
