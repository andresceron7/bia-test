import {Avatar, Badge, BarList, Card, ColumnChart, CompareBars, formatNumber, formatPercent, ProgressRing, Stat} from '../../design-system';
import {MONTHLY_GOAL, OWNERS} from './model';

/**
 * Resultados del periodo: cierres del equipo completo.
 * Estos datos NO responden a los filtros, y la sección lo dice explícitamente.
 */
export function ResultsSection({data: d, period}) {
  const progress = d.closed / MONTHLY_GOAL;
  const previous = d.history[d.history.length - 2];
  const delta = d.closed - previous;
  const remaining = Math.max(MONTHLY_GOAL - d.closed, 0);
  const history = d.history.map((value, i) => ({label: d.labels[i], value}));
  const average = d.history.reduce((sum, v) => sum + v, 0) / d.history.length;
  const rank = [...d.history].sort((a, b) => b - a).indexOf(d.closed) + 1;
  const capitalize = text => text[0].toUpperCase() + text.slice(1);
  const comparison = [
    {id: 'current', label: period.long.split(' ')[0], value: d.closed, highlight: true},
    {id: 'previous', label: capitalize(period.previous), value: previous},
    {id: 'average', label: 'Promedio 6 meses', value: average},
  ];
  const owners = OWNERS.map((name, i) => ({id: name, label: name, value: d.owners[i]})).sort((a, b) => b.value - a.value);

  return (
    <section className="olb-section" aria-labelledby="results-title">
      <div className="olb-section__head">
        <h2 id="results-title">Resultados del periodo</h2>
        <Badge tone="neutral">Total del equipo · no cambia con filtros</Badge>
      </div>

      <div className="olb-grid olb-grid--results">
        <Card className="olb-goal" style={{'--enter-delay': '0ms'}}>
          <ProgressRing value={progress} size={144} label={`${formatPercent(progress * 100)} de la meta de ${MONTHLY_GOAL} cierres`}>
            <span className="olb-goal__pct ds-tabular">{formatPercent(progress * 100)}</span>
            <span className="olb-goal__of">de la meta</span>
          </ProgressRing>
          <Stat
            size="lg"
            label="Cierres del mes"
            value={d.closed}
            unit={`/ ${MONTHLY_GOAL}`}
            delta={delta}
            deltaLabel={`${delta > 0 ? '+' : '−'}${Math.abs(delta)} vs ${period.previous}`}
            caption={remaining ? `Faltan ${remaining} para la meta` : 'Meta alcanzada'}
          />
          <div className="olb-goal__compare">
            <span className="ds-eyebrow">Comparación</span>
            <CompareBars
              rows={comparison}
              goal={MONTHLY_GOAL}
              max={MONTHLY_GOAL * 1.2}
              format={v => formatNumber(Math.round(v * 10) / 10)}
            />
            <p className="olb-goal__insight">
              {rank === 1 ? 'Mejor mes de los últimos 6.' : `${rank}.º mejor mes de los últimos 6.`} La línea marca la meta de{' '}
              {MONTHLY_GOAL}.
            </p>
          </div>
        </Card>

        <Card title="Cierres por mes" eyebrow="Últimos 6 meses" style={{'--enter-delay': '60ms'}}>
          <ColumnChart
            data={history}
            goal={MONTHLY_GOAL}
            describe={p => `${p.label}: ${p.value} cierres · ${formatPercent((p.value / MONTHLY_GOAL) * 100)} de la meta`}
          />
        </Card>

        <Card title="Cierres por ejecutivo" eyebrow={`${d.closed} cierres en total`} style={{'--enter-delay': '120ms'}}>
          <BarList rows={owners} max={Math.max(...d.owners, 1)} leading={row => <Avatar name={row.label} size={24} />} />
        </Card>
      </div>
    </section>
  );
}
