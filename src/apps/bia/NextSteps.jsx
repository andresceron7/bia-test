import {useState} from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  IconAlert,
  IconChecklist,
  IconCircleCheck,
  IconWrench,
  SegmentedControl,
  useToast,
} from '../../design-system';
import {NIGHT_SAVINGS, SITES} from './data';
import {formatCOP} from './format';

const MANAGER = SITES.find(s => s.id === 'chapinero').manager;
const CHECKLIST = [
  {id: 'oven', label: 'Horno y plancha apagados', description: 'Revisar también el interruptor general de la cocina.'},
  {id: 'espresso', label: 'Máquina de espresso en apagado', description: 'No en modo de reposo: el reposo mantiene la caldera caliente.'},
  {id: 'heater', label: 'Calentador de agua apagado'},
  {id: 'cold', label: 'Puertas de neveras y cuarto frío bien cerradas', description: 'Revisar que los empaques sellen.'},
  {
    id: 'new',
    label: '¿Se instaló o cambió algo desde el 12 de octubre?',
    description: 'Un equipo nuevo, limpieza nocturna o un turno distinto.',
  },
];
const SLOTS = [
  {value: 'mar', label: 'Mar 4 · 9:00'},
  {value: 'mie', label: 'Mié 5 · 15:00'},
  {value: 'jue', label: 'Jue 6 · 7:00'},
];
// Simula la respuesta del servidor
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function StepCard({index, icon: Icon, title, description, impact, status, children}) {
  const done = Boolean(status);
  return (
    <li className="bia-step ds-card" data-done={done}>
      <div className="bia-step__head">
        <span className="bia-step__index ds-tabular" aria-hidden="true">
          {done ? <IconCircleCheck size={20} strokeWidth={1.8} /> : index}
        </span>
        <span className="bia-step__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.6} />
        </span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {impact && <p className="bia-step__impact">{impact}</p>}
      <div className="bia-step__action" aria-live="polite">
        {status && <p className="bia-step__status">{status}</p>}
        {children}
      </div>
    </li>
  );
}

/** Siguientes pasos, en orden: confirmar la causa, vigilar y, si hace falta, pedir ayuda. */
export function NextSteps({sectionRef}) {
  const notify = useToast();
  const [drawer, setDrawer] = useState(false);
  const [checked, setChecked] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [alertState, setAlertState] = useState('off'); // off | saving | on
  const [slot, setSlot] = useState('mar');
  const [visit, setVisit] = useState('idle'); // idle | picking | saving | booked

  const sendChecklist = async () => {
    setSending(true);
    await wait(900);
    setSending(false);
    setSent(true);
    setDrawer(false);
    notify(`Checklist enviado a ${MANAGER}.`);
  };

  const toggleAlert = async () => {
    const next = alertState === 'on' ? 'off' : 'on';
    setAlertState('saving');
    await wait(700);
    setAlertState(next);
    notify(next === 'on' ? 'Alerta nocturna activada.' : 'Alerta nocturna desactivada.', {tone: next === 'on' ? 'success' : 'info'});
  };

  const bookVisit = async () => {
    setVisit('saving');
    await wait(900);
    setVisit('booked');
    notify('Visita técnica agendada.');
  };

  const completed = [sent, alertState === 'on', visit === 'booked'].filter(Boolean).length;
  const slotLabel = SLOTS.find(s => s.value === slot).label;

  return (
    <section ref={sectionRef} className="bia-section" aria-labelledby="bia-next">
      <header className="bia-section__head bia-section__head--row">
        <div>
          <span className="ds-eyebrow">Qué hacer ahora</span>
          <h2 tabIndex={-1} id="bia-next">
            Tres pasos, en este orden
          </h2>
          <p>Empieza por el primero: confirma la causa más probable sin costo y en pocos minutos.</p>
        </div>
        <div className="bia-progress" aria-live="polite">
          <span className="ds-tabular">{completed} de 3 pasos</span>
          <span className="bia-progress__track" aria-hidden="true">
            <span style={{width: `${(completed / 3) * 100}%`}} />
          </span>
        </div>
      </header>

      <ol className="bia-steps">
        <StepCard
          index={1}
          icon={IconChecklist}
          title="Revisar Chapinero hoy al cierre"
          description={`Un checklist de 5 puntos para ${MANAGER}, la encargada. Toma unos 10 minutos.`}
          impact={
            <>
              Si es un equipo encendido, ahorrarías hasta <strong>{formatCOP(NIGHT_SAVINGS)} al mes</strong>{' '}
              <Badge tone="neutral">Estimado</Badge>
            </>
          }
          status={sent && `Enviado a ${MANAGER}. Mañana te mostramos si bajó el consumo nocturno.`}
        >
          <Button variant={sent ? 'secondary' : 'primary'} onClick={() => setDrawer(true)}>
            {sent ? 'Ver checklist' : 'Preparar checklist'}
          </Button>
        </StepCard>

        <StepCard
          index={2}
          icon={IconAlert}
          title="Activar la alerta nocturna"
          description="Te avisamos por WhatsApp si una sede consume más de 3 kW con el local cerrado."
          impact="Detecta el problema el mismo día, no al llegar la factura."
          status={alertState === 'on' && 'Activa para las 3 sedes, de 20:00 a 6:00.'}
        >
          <Button variant={alertState === 'on' ? 'ghost' : 'primary'} loading={alertState === 'saving'} onClick={toggleAlert}>
            {alertState === 'on' ? 'Desactivar alerta' : 'Activar alerta'}
          </Button>
        </StepCard>

        <StepCard
          index={3}
          icon={IconWrench}
          title="Pedir una visita técnica"
          description="Si la revisión no resuelve el consumo nocturno, un técnico de Bia mide equipo por equipo."
          impact="Sin costo adicional en tu plan."
          status={visit === 'booked' && `Agendada: ${slotLabel}, sede Chapinero.`}
        >
          {visit === 'idle' && <Button onClick={() => setVisit('picking')}>Elegir horario</Button>}
          {(visit === 'picking' || visit === 'saving') && (
            <div className="bia-slots">
              <SegmentedControl label="Horario de la visita" options={SLOTS} value={slot} onChange={setSlot} />
              <div className="bia-slots__actions">
                <Button variant="primary" loading={visit === 'saving'} onClick={bookVisit}>
                  Confirmar visita
                </Button>
                <Button variant="ghost" disabled={visit === 'saving'} onClick={() => setVisit('idle')}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          {visit === 'booked' && (
            <Button variant="ghost" onClick={() => setVisit('picking')}>
              Cambiar horario
            </Button>
          )}
        </StepCard>
      </ol>

      <Drawer
        open={drawer}
        eyebrow="Paso 1 · Sede Chapinero"
        title="Checklist de cierre"
        onClose={() => setDrawer(false)}
        footer={
          sent ? (
            <p className="bia-drawer-note">
              <IconCircleCheck size={20} strokeWidth={1.8} aria-hidden="true" />
              Ya se envió a {MANAGER}.
            </p>
          ) : (
            <Button variant="primary" className="bia-full" loading={sending} onClick={sendChecklist}>
              Enviar a {MANAGER}
            </Button>
          )
        }
      >
        <p className="bia-drawer-intro">
          Puedes revisarlo tú o enviarlo a la encargada. Si el consumo nocturno baja mañana, confirmamos la causa y te mostramos el ahorro.
        </p>
        <div className="bia-checklist" role="group" aria-label="Puntos a revisar">
          {CHECKLIST.map(item => (
            <Checkbox
              key={item.id}
              label={item.label}
              description={item.description}
              checked={Boolean(checked[item.id])}
              onChange={value => setChecked(c => ({...c, [item.id]: value}))}
            />
          ))}
        </div>
      </Drawer>
    </section>
  );
}
