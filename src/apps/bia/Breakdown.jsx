import {useState} from 'react';
import {
  Badge,
  Button,
  Card,
  IconArrowRight,
  IconFact,
  IconQuestion,
  MonthPicker,
  SegmentedControl,
  StackedBars,
  WaterfallChart,
} from '../../design-system';
import {BILL, DRIVERS, SITES} from './data';
import {formatCOP, formatKwh, formatPct, toPesos} from './format';

const TOTAL_INCREASE = DRIVERS.reduce((sum, d) => sum + d.kwh, 0);
const NIGHT = DRIVERS.find(d => d.id === 'night');
const UNITS = [
  {value: 'money', label: 'Dinero'},
  {value: 'kwh', label: 'kWh'},
];
const VIEWS = [
  {value: 'diff', label: 'Ver diferencial'},
  {value: 'full', label: 'Ver completo'},
];
// Por ahora solo octubre tiene el detalle de consumo
const DETAIL_MONTHS = [9];

// Cada unidad define cómo convertir kWh, cómo formatear y dónde cortar el eje de la cascada
const UNIT = {
  money: {convert: toPesos, format: formatCOP, other: kwh => formatKwh(kwh), baseline: 4.4e6},
  kwh: {convert: kwh => kwh, format: formatKwh, other: kwh => formatCOP(toPesos(kwh)), baseline: 5500},
};

const site = id => SITES.find(s => s.id === id);
// Consumo completo por sede; el consumo nocturno de Chapinero va aparte
const SERIES = [
  {id: 'chapinero', label: 'Chapinero', tone: 'subtle'},
  {id: 'night', label: 'Chapinero fuera de horario', tone: 'accent'},
  {id: 'usaquen', label: 'Usaquén', tone: 'alt'},
  {id: 'cedritos', label: 'Cedritos', tone: 'muted'},
];
const FULL_ROWS = [
  {
    id: 'previous',
    label: BILL.previous.label,
    values: {chapinero: site('chapinero').previous, usaquen: site('usaquen').previous, cedritos: site('cedritos').previous},
  },
  {
    id: 'current',
    label: BILL.current.label,
    highlight: true,
    values: {
      chapinero: site('chapinero').current - NIGHT.kwh,
      night: NIGHT.kwh,
      usaquen: site('usaquen').current,
      cedritos: site('cedritos').current,
    },
  },
];

/** Panel fijo: el hallazgo principal no cambia con los filtros, solo con la unidad. */
function NightCard({unit, onExplore}) {
  const u = UNIT[unit];
  return (
    <div className="bia-detail">
      <span className="ds-eyebrow">{NIGHT.label}</span>
      <p className="bia-detail__amount ds-tabular">
        +{u.format(u.convert(NIGHT.kwh))}
        <small>
          +{u.other(NIGHT.kwh)} · {formatPct((NIGHT.kwh / TOTAL_INCREASE) * 100)} del aumento
        </small>
      </p>
      <p>{NIGHT.summary[unit]}</p>
      <div className="bia-detail__tags">
        <Badge tone="success" icon={IconFact}>
          Medido
        </Badge>
        <Badge tone="warning" icon={IconQuestion}>
          Causa por confirmar
        </Badge>
      </div>
      <Button variant="secondary" size="sm" onClick={() => onExplore(NIGHT)}>
        Ver la sede
        <IconArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
      </Button>
    </div>
  );
}

/** Detalles de consumo del mes: el diferencial frente al mes anterior o el consumo completo. */
export function Breakdown({onExplore, sectionRef}) {
  const [unit, setUnit] = useState('money');
  const [month, setMonth] = useState(9);
  const [view, setView] = useState('diff');
  const u = UNIT[unit];
  const unitName = unit === 'money' ? 'pesos' : 'kWh';

  const steps = [
    {id: 'previous', label: BILL.previous.label, value: u.convert(BILL.previous.kwh), kind: 'total'},
    ...DRIVERS.map(d => ({id: d.id, label: d.label, value: u.convert(d.kwh), kind: 'delta', emphasis: d.emphasis})),
    {id: 'current', label: BILL.current.label, value: u.convert(BILL.current.kwh), kind: 'total'},
  ];
  const fullRows = FULL_ROWS.map(r => ({
    ...r,
    values: Object.fromEntries(Object.entries(r.values).map(([k, v]) => [k, u.convert(v)])),
  }));

  return (
    <section ref={sectionRef} className="bia-section" aria-labelledby="bia-why">
      <header className="bia-section__head bia-section__head--row">
        <h2 tabIndex={-1} id="bia-why">
          Detalles de consumo
        </h2>
        <SegmentedControl label="Unidad" options={UNITS} value={unit} onChange={setUnit} />
      </header>
      <Card as="div" className="bia-breakdown">
        <div className="bia-breakdown__chart">
          <div className="bia-breakdown__toolbar">
            <MonthPicker label="Mes" year={2026} value={month} available={DETAIL_MONTHS} onChange={setMonth} />
            <SegmentedControl label="Vista del consumo" options={VIEWS} value={view} onChange={setView} />
          </div>
          {view === 'diff' ? (
            <WaterfallChart
              key={unit}
              baseline={u.baseline}
              steps={steps}
              format={u.format}
              label={`Diferencia de consumo entre septiembre y octubre, en ${unitName}`}
            />
          ) : (
            <StackedBars
              key={unit}
              series={SERIES}
              rows={fullRows}
              format={u.format}
              label={`Consumo completo de septiembre y octubre por sede, en ${unitName}`}
            />
          )}
        </div>
        <NightCard unit={unit} onExplore={onExplore} />
      </Card>
    </section>
  );
}
