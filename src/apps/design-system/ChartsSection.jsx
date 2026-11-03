import {useId, useState} from 'react';
import {
  Avatar,
  BarList,
  Button,
  ColumnChart,
  CompareBars,
  formatPercent,
  ProfileChart,
  ProgressRing,
  ShareBar,
  StackedBars,
  WaterfallChart,
} from '../../design-system';
import {Specimen} from './Specimen';

const MONTHS = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'];
const randomSeries = () => MONTHS.map(label => ({label, value: 2 + Math.round(Math.random() * 9)}));

function Range({label, value, min, max, onChange, format = v => v}) {
  const id = useId();
  return (
    <div className="dsp-range">
      <label htmlFor={id}>
        {label}
        <span className="ds-tabular">{format(value)}</span>
      </label>
      <input id={id} type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

export function ChartsSection() {
  const [series, setSeries] = useState(() => MONTHS.map((label, i) => ({label, value: [4, 6, 5, 7, 6, 8][i]})));
  const [goal, setGoal] = useState(10);
  const [progress, setProgress] = useState(80);
  const [stage, setStage] = useState('');
  const [channel, setChannel] = useState('');
  const [step, setStep] = useState('b');

  const stages = [
    {id: 'Contacto', label: 'Contacto', value: 2, secondary: '$40 M'},
    {id: 'Calificación', label: 'Calificación', value: 2, secondary: '$76 M'},
    {id: 'Propuesta', label: 'Propuesta', value: 2, secondary: '$79 M'},
    {id: 'Negociación', label: 'Negociación', value: 2, secondary: '$143 M'},
  ];
  const owners = [
    {id: 'a', label: 'Ana López', value: 3},
    {id: 'c', label: 'Carlos Ruiz', value: 2},
    {id: 'm', label: 'Mateo Gil', value: 1},
  ];
  const last = series[series.length - 1].value;
  const average = series.reduce((sum, d) => sum + d.value, 0) / series.length;

  return (
    <section className="dsp-section" aria-labelledby="graficas">
      <h2 id="graficas" className="dsp-section__title">
        Gráficas
      </h2>

      <Specimen
        id="columnas"
        title="ColumnChart"
        description="Columnas con línea de meta. El periodo actual se destaca en acento; el resto usa gris de datos (3:1). Cada columna es enfocable."
        controls={
          <>
            <Range label="Meta" value={goal} min={4} max={14} onChange={setGoal} />
            <Button size="sm" onClick={() => setSeries(randomSeries())}>
              Generar datos
            </Button>
          </>
        }
      >
        <ColumnChart
          data={series}
          goal={goal}
          describe={p => `${p.label}: ${p.value} cierres · ${formatPercent((p.value / goal) * 100)} de la meta`}
        />
      </Specimen>

      <div className="dsp-grid-2">
        <Specimen
          id="anillo"
          title="ProgressRing"
          description="Progreso hacia una meta, con lectura en el centro."
          controls={<Range label="Progreso" value={progress} min={0} max={100} onChange={setProgress} format={v => `${v}%`} />}
          stageClassName="dsp-center"
        >
          <ProgressRing value={progress / 100} label={`${progress}% de la meta`}>
            <span className="dsp-ring-value ds-tabular">{progress}%</span>
            <span className="dsp-muted">de la meta</span>
          </ProgressRing>
        </Specimen>

        <Specimen id="comparacion" title="CompareBars" description="Contrasta el valor actual con referencias sobre una misma escala.">
          <CompareBars
            rows={[
              {id: 'now', label: 'Actual', value: last, highlight: true},
              {id: 'prev', label: 'Anterior', value: series[series.length - 2].value},
              {id: 'avg', label: 'Promedio', value: average},
            ]}
            goal={goal}
            max={Math.max(goal, ...series.map(d => d.value)) * 1.2}
            format={v => Math.round(v * 10) / 10}
          />
        </Specimen>
      </div>

      <Specimen
        id="cascada"
        title="WaterfallChart"
        description="Cascada de aportes con pasos seleccionables. Admite eje cortado (marcado) y, en contenedores angostos, se dibuja en filas horizontales."
      >
        <WaterfallChart
          steps={[
            {id: 'a', label: 'Inicio', value: 100, kind: 'total'},
            {id: 'b', label: 'Aporte principal', value: 40, kind: 'delta', emphasis: true},
            {id: 'c', label: 'Aporte menor', value: 15, kind: 'delta'},
            {id: 'd', label: 'Otro aporte', value: 10, kind: 'delta'},
            {id: 'e', label: 'Final', value: 165, kind: 'total'},
          ]}
          baseline={80}
          selectedId={step}
          onSelect={setStep}
          label="Ejemplo de cascada"
        />
      </Specimen>

      <Specimen
        id="apiladas"
        title="StackedBars"
        description="Barras horizontales apiladas: compara totales y su composición. La longitud es proporcional al total y la tabla da el valor de cada serie."
      >
        <StackedBars
          label="Ejemplo de barras apiladas"
          series={[
            {id: 'a', label: 'Serie A', tone: 'subtle'},
            {id: 'b', label: 'Serie destacada', tone: 'accent'},
            {id: 'c', label: 'Serie C', tone: 'alt'},
            {id: 'd', label: 'Serie D', tone: 'muted'},
          ]}
          rows={[
            {id: 'p', label: 'Periodo anterior', values: {a: 40, c: 30, d: 20}},
            {id: 'n', label: 'Periodo actual', highlight: true, values: {a: 42, b: 18, c: 32, d: 21}},
          ]}
        />
      </Specimen>

      <Specimen
        id="perfil"
        title="ProfileChart"
        description="Perfil de 24 horas que compara dos series y sombrea franjas horarias. Se recorre con el puntero o con las flechas; la lectura se anuncia a lectores de pantalla."
      >
        <ProfileChart
          label="Ejemplo de perfil horario"
          series={[
            {id: 'a', label: 'Referencia', values: [2, 2, 2, 2, 2, 2, 4, 6, 7, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 2, 2, 2, 2], tone: 'muted'},
            {id: 'b', label: 'Actual', values: [5, 5, 5, 5, 5, 5, 5, 7, 8, 7, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5], tone: 'accent'},
          ]}
          bands={[{from: 20, to: 6, label: 'Franja destacada'}]}
        />
      </Specimen>

      <div className="dsp-grid-2">
        <Specimen
          id="barlist"
          title="BarList"
          description="Interactiva: cada fila es un botón que filtra (aria-pressed). Estática: ranking con avatar."
        >
          <BarList rows={stages} max={8} onSelect={id => setStage(s => (s === id ? '' : id))} activeId={stage} />
          <div className="dsp-divider" />
          <BarList rows={owners} max={3} leading={row => <Avatar name={row.label} size={24} />} />
        </Specimen>

        <Specimen id="sharebar" title="ShareBar" description="Composición al 100%. La leyenda es la vía accesible y filtra al tocarla.">
          <ShareBar
            segments={[
              {id: 'Outbound', label: 'Outbound', value: 4},
              {id: 'Referidos', label: 'Referidos', value: 3},
              {id: 'Inbound', label: 'Inbound', value: 1},
            ]}
            onSelect={id => setChannel(c => (c === id ? '' : id))}
            activeId={channel}
          />
        </Specimen>
      </div>
    </section>
  );
}
