import {useState} from 'react';
import {Badge, Button, Card, ColumnChart, IconPin, IconWarning} from '../../design-system';
import {ANOMALY_START, DAILY, SEPTEMBER_DAILY, SITES} from './data';
import {formatKwh, formatPct} from './format';
import {HypothesesDialog} from './Hypotheses';

const TOTAL_INCREASE = SITES.reduce((sum, s) => sum + s.current - s.previous, 0);
const MAX_SITE = Math.max(...SITES.map(s => s.current));

/** Sedes: dónde está el aumento y, para la elegida, cómo se comportó cada día de octubre. */
export function SiteExplorer({siteId, onSite, sectionRef, onWhatToDo}) {
  const [details, setDetails] = useState(false);
  const site = SITES.find(s => s.id === siteId);
  const anomaly = siteId === 'chapinero';
  const daily = DAILY[siteId].map(d => ({label: String(d.day), value: d.kwh, day: d.day}));

  return (
    <section ref={sectionRef} className="bia-section" aria-labelledby="bia-sites">
      <header className="bia-section__head">
        <h2 tabIndex={-1} id="bia-sites">
          Tus sedes
        </h2>
      </header>

      <div className="bia-sites" role="group" aria-label="Elegir sede">
        {SITES.map(s => {
          const diff = s.current - s.previous;
          const share = (diff / TOTAL_INCREASE) * 100;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === siteId}
              className="bia-site"
              data-alert={s.id === 'chapinero' || undefined}
              onClick={() => onSite(s.id)}
            >
              <span className="bia-site__name">
                <IconPin size={16} strokeWidth={1.8} aria-hidden="true" />
                {s.name}
              </span>
              <span className="bia-site__delta ds-tabular">+{formatKwh(diff)}</span>
              <span className="bia-site__share" aria-hidden="true">
                <span style={{width: `${share}%`}} />
              </span>
              <span className="bia-site__meta">{formatPct(share)} del aumento</span>
              <span className="bia-site__compare">
                {[
                  {label: 'Sep', value: s.previous, tone: 'previous'},
                  {label: 'Oct', value: s.current, tone: 'current'},
                ].map(row => (
                  <span key={row.label} className="bia-site__bar" data-tone={row.tone}>
                    <span className="bia-site__bar-label">{row.label}</span>
                    <span className="bia-site__bar-track" aria-hidden="true">
                      <span style={{width: `${(row.value / MAX_SITE) * 100}%`}} />
                    </span>
                    <span className="bia-site__bar-value ds-tabular">{formatKwh(row.value)}</span>
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <Card as="div" className="bia-explorer" title={`${site.name} · octubre, día por día`} eyebrow={`Encargada: ${site.manager}`}>
        {anomaly ? (
          <div className="bia-alert" role="status">
            <IconWarning size={20} strokeWidth={1.8} aria-hidden="true" />
            <p>
              <strong>Fuera de lo normal:</strong> desde el {ANOMALY_START} de octubre, de noche consume unos 6 kW; antes eran 1,5 kW. La
              sede está cerrada de 20:00 a 6:00.
            </p>
            <Button size="sm" onClick={() => setDetails(true)}>
              Ver detalles
            </Button>
          </div>
        ) : (
          <p className="bia-insight">
            <Badge tone="success">Normal</Badge>
            <span>Sin consumo relevante con la sede cerrada.</span>
          </p>
        )}
        <ColumnChart
          key={siteId}
          label={`Consumo diario de ${site.name} en octubre`}
          data={daily}
          step={anomaly ? 40 : 20}
          goal={SEPTEMBER_DAILY[siteId]}
          goalLabel={`Promedio de septiembre · ${SEPTEMBER_DAILY[siteId]} kWh`}
          isHighlighted={d => anomaly && d.day >= ANOMALY_START}
          showHighlightValues={false}
          labelEvery={1}
          describe={d => `${d.label} de octubre: ${d.value} kWh`}
          height={240}
        />
      </Card>

      <HypothesesDialog
        open={details}
        onClose={() => setDetails(false)}
        onWhatToDo={() => {
          setDetails(false);
          // Espera a que el popup se cierre y devuelva el foco antes de desplazarse
          setTimeout(onWhatToDo, 340);
        }}
      />
    </section>
  );
}
