import {useState} from 'react';
import {Badge, Button, IconArrowRight, IconBolt, MonthPicker} from '../../design-system';
import {BILL, NIGHT_SAVINGS, TARIFF} from './data';
import {formatCOP, formatKwh, formatPct, toPesos} from './format';

// Octubre es el mes actual; por ahora solo hay datos para comparar con septiembre
const COMPARABLE_MONTHS = [8];

/** Módulo principal: la factura actual frente al mes elegido, con la explicación en un tercio. */
export function Comparison({onWhatToDo}) {
  const [month, setMonth] = useState(8);
  const before = toPesos(BILL.previous.kwh);
  const after = toPesos(BILL.current.kwh);
  const diff = after - before;

  return (
    <section className="bia-compare ds-card" aria-labelledby="bia-answer">
      <div className="bia-compare__explain">
        <span className="ds-eyebrow">Tu factura de octubre</span>
        <h1 id="bia-answer">
          Subió <mark>{formatCOP(diff)}</mark> porque tus cafeterías consumieron <mark>1.500 kWh más</mark>.
        </h1>
        <p>
          La tarifa no cambió. El <strong>80% viene de Chapinero</strong>, de noche, con la sede cerrada.
        </p>
        <Button variant="primary" size="sm" onClick={onWhatToDo}>
          Ver qué hacer
          <IconArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </Button>
      </div>

      <div className="bia-compare__data">
        <div className="bia-compare__head">
          <span className="ds-eyebrow">Factura de energía</span>
          <MonthPicker label="Comparar con" year={2026} value={month} available={COMPARABLE_MONTHS} onChange={setMonth} />
        </div>

        <dl className="bia-bill__bars">
          {[
            {label: BILL.previous.label, value: before, tone: 'muted'},
            {label: `${BILL.current.label} · actual`, value: after, tone: 'current'},
          ].map(row => (
            <div key={row.label} className="bia-bill__row" data-tone={row.tone}>
              <dt>{row.label}</dt>
              <dd>
                <span className="bia-bill__track" aria-hidden="true">
                  <span style={{width: `${(row.value / after) * 100}%`}} />
                </span>
                <span className="ds-tabular">{formatCOP(row.value)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ul className="bia-bill__facts">
          <li>
            <span>Diferencia</span>
            <strong className="ds-tabular">
              +{formatCOP(diff)} <Badge tone="warning">+{formatPct((diff / before) * 100)}</Badge>
            </strong>
          </li>
          <li>
            <span>Consumo</span>
            <strong className="ds-tabular">
              {formatKwh(BILL.previous.kwh)} → {formatKwh(BILL.current.kwh)}
            </strong>
          </li>
          <li>
            <span>Tarifa</span>
            <strong className="ds-tabular">${TARIFF}/kWh · sin cambios</strong>
          </li>
          <li className="bia-bill__saving">
            <span>
              <IconBolt size={16} strokeWidth={1.8} aria-hidden="true" /> Ahorro posible
            </span>
            <strong className="ds-tabular">
              hasta {formatCOP(NIGHT_SAVINGS)}/mes <small>estimado</small>
            </strong>
          </li>
        </ul>
      </div>
    </section>
  );
}
