import {useRef, useState} from 'react';
import {Popover} from './Popover';
import {IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight} from '../icons';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_LONG = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * Selector de periodo mensual: botón + calendario de 12 meses en cuadrícula.
 * Solo los meses de `available` (índices 0–11) se pueden elegir; el resto se ve deshabilitado.
 */
export function MonthPicker({label = 'Periodo', year, value, available, onChange}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const cells = useRef([]);
  const enabled = MONTHS.map((_, i) => available.includes(i));

  const pick = month => {
    onChange(month);
    setOpen(false);
    trigger.current?.focus();
  };

  // Flechas: salta al siguiente mes disponible en la dirección (horizontal ±1, vertical ±3)
  const onKeyDown = e => {
    const steps = {ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3};
    const step = steps[e.key];
    if (!step) return;
    e.preventDefault();
    const from = cells.current.indexOf(document.activeElement);
    for (let i = from + step; i >= 0 && i < 12; i += step) {
      if (enabled[i]) return cells.current[i].focus();
    }
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="ds-month-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}: ${MONTHS_LONG[value]} ${year}`}
        onClick={() => setOpen(o => !o)}
      >
        <IconCalendar size={20} strokeWidth={1.6} aria-hidden="true" />
        <span>{label}</span>
        <span className="ds-month-trigger__dot" aria-hidden="true">
          ·
        </span>
        <span className="ds-month-trigger__value" aria-hidden="true">
          {MONTHS[value]}
        </span>
        <IconChevronDown size={16} strokeWidth={1.6} aria-hidden="true" className="ds-month-trigger__chevron" />
      </button>

      <Popover open={open} anchor={trigger.current} label={`Elegir ${label.toLowerCase()}`} onClose={() => setOpen(false)}>
        <div className="ds-month">
          <header className="ds-month__head">
            <button type="button" className="ds-month__nav" disabled aria-label="Año anterior (sin datos)">
              <IconChevronLeft size={16} strokeWidth={1.8} />
            </button>
            <span className="ds-month__year ds-tabular">{year}</span>
            <button type="button" className="ds-month__nav" disabled aria-label="Año siguiente (sin datos)">
              <IconChevronRight size={16} strokeWidth={1.8} />
            </button>
          </header>
          <div className="ds-month__grid" onKeyDown={onKeyDown}>
            {MONTHS.map((m, i) => (
              <button
                key={m}
                ref={el => (cells.current[i] = el)}
                type="button"
                className="ds-month__cell"
                disabled={!enabled[i]}
                aria-pressed={i === value}
                aria-label={`${MONTHS_LONG[i]} ${year}${enabled[i] ? '' : ', sin datos'}`}
                data-autofocus={i === value || undefined}
                onClick={() => pick(i)}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="ds-month__note">Datos disponibles: {available.map(i => MONTHS_LONG[i].toLowerCase()).join(' y ')}.</p>
        </div>
      </Popover>
    </>
  );
}
