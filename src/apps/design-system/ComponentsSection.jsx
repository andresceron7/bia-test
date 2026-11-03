import {useRef, useState} from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Drawer,
  EmptyState,
  IconBell,
  IconCheck,
  IconCircleCheck,
  IconDownload,
  IconFile,
  IconLogOut,
  IconSearch,
  IconSparkles,
  IconUser,
  MenuItem,
  MenuSection,
  MonthPicker,
  Popover,
  SearchField,
  SegmentedControl,
  Select,
  Skeleton,
  Stat,
  ThemeSwitch,
  Tooltip,
  useToast,
} from '../../design-system';
import {Control, Specimen} from './Specimen';

const YES_NO = [
  {value: 'no', label: 'No'},
  {value: 'yes', label: 'Sí'},
];

function ButtonSpecimen() {
  const [variant, setVariant] = useState('primary');
  const [size, setSize] = useState('md');
  const [icon, setIcon] = useState('yes');
  const [iconOnly, setIconOnly] = useState('no');
  const [disabled, setDisabled] = useState('no');
  return (
    <Specimen
      id="boton"
      title="Button"
      description="Tres jerarquías y dos tamaños (32 / 40 px). Con solo icono, la etiqueta pasa a ser nombre accesible y tooltip."
      controls={
        <>
          <Control label="Variante">
            <SegmentedControl
              label="Variante"
              value={variant}
              onChange={setVariant}
              options={['primary', 'secondary', 'ghost'].map(v => ({value: v, label: v}))}
            />
          </Control>
          <Control label="Tamaño">
            <SegmentedControl
              label="Tamaño"
              value={size}
              onChange={setSize}
              options={[
                {value: 'sm', label: 'sm'},
                {value: 'md', label: 'md'},
              ]}
            />
          </Control>
          <Control label="Icono">
            <SegmentedControl label="Icono" value={icon} onChange={setIcon} options={YES_NO} />
          </Control>
          <Control label="Solo icono">
            <SegmentedControl label="Solo icono" value={iconOnly} onChange={setIconOnly} options={YES_NO} />
          </Control>
          <Control label="Deshabilitado">
            <SegmentedControl label="Deshabilitado" value={disabled} onChange={setDisabled} options={YES_NO} />
          </Control>
        </>
      }
    >
      <Button
        variant={variant}
        size={size}
        icon={icon === 'yes' || iconOnly === 'yes' ? IconDownload : undefined}
        iconOnly={iconOnly === 'yes'}
        label="Exportar CSV"
        disabled={disabled === 'yes'}
      />
    </Specimen>
  );
}

function BadgeSpecimen() {
  return (
    <Specimen id="badge" title="Badge" description="Etiqueta compacta de 24 px. Tonos con contraste AA; admite punto o icono.">
      <div className="dsp-row">
        <Badge>Neutral</Badge>
        <Badge tone="accent" dot>
          2 filtros activos
        </Badge>
        <Badge tone="success" icon={IconCircleCheck}>
          Seguimiento
        </Badge>
        <Badge tone="warning">Atención</Badge>
      </div>
    </Specimen>
  );
}

function FieldsSpecimen() {
  const [stage, setStage] = useState('');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState(9);
  const [period, setPeriod] = useState('mes');
  return (
    <Specimen
      id="campos"
      title="Campos y selectores"
      description="Contorno de 1 px a 3:1; al tener valor, el campo se marca en acento. El calendario solo habilita los meses con datos."
    >
      <div className="dsp-fields">
        <Select
          label="Etapa"
          placeholder="Todas"
          value={stage}
          onChange={setStage}
          options={['Contacto', 'Calificación', 'Propuesta', 'Negociación']}
        />
        <div className="dsp-field-search">
          <span className="ds-select__label" aria-hidden="true">
            Búsqueda
          </span>
          <SearchField label="Buscar empresa" placeholder="Buscar empresa" value={query} onChange={setQuery} />
        </div>
        <div>
          <span className="ds-select__label" aria-hidden="true">
            Periodo
          </span>
          <div className="dsp-row">
            <MonthPicker year={2026} value={month} available={[8, 9]} onChange={setMonth} />
          </div>
        </div>
        <div>
          <span className="ds-select__label" aria-hidden="true">
            Segmentado
          </span>
          <SegmentedControl
            label="Agrupar por"
            value={period}
            onChange={setPeriod}
            options={[
              {value: 'semana', label: 'Semana'},
              {value: 'mes', label: 'Mes'},
              {value: 'trimestre', label: 'Trimestre'},
            ]}
          />
        </div>
      </div>
    </Specimen>
  );
}

function SwitchTooltipSpecimen({theme, onToggleTheme}) {
  return (
    <Specimen
      id="switch"
      title="Switch y Tooltip"
      description="El switch cambia el tema de toda la página. Los tooltips aparecen con hover o foco y se cierran con Escape."
    >
      <div className="dsp-row dsp-row--spread">
        <div className="dsp-row">
          <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
          <span className="dsp-muted">Modo {theme === 'dark' ? 'oscuro' : 'claro'}</span>
        </div>
        <div className="dsp-row">
          {['top', 'bottom', 'right'].map(side => (
            <Tooltip key={side} content={`Tooltip ${side}`} side={side}>
              <button type="button" className="dsp-chip">
                {side}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </Specimen>
  );
}

function StatCardSpecimen() {
  const [size, setSize] = useState('md');
  const [trend, setTrend] = useState('up');
  return (
    <Specimen
      id="stat"
      title="Stat y Card"
      description="Métrica protagonista en peso ligero dentro de un módulo flotante. La tendencia combina icono, signo y color."
      controls={
        <>
          <Control label="Tamaño">
            <SegmentedControl
              label="Tamaño de la métrica"
              value={size}
              onChange={setSize}
              options={[
                {value: 'md', label: 'md'},
                {value: 'lg', label: 'lg'},
              ]}
            />
          </Control>
          <Control label="Tendencia">
            <SegmentedControl
              label="Tendencia"
              value={trend}
              onChange={setTrend}
              options={[
                {value: 'up', label: 'Sube'},
                {value: 'down', label: 'Baja'},
              ]}
            />
          </Control>
        </>
      }
    >
      <Card title="Cierres del mes" eyebrow="Octubre 2026" scope={<Badge>Ejemplo</Badge>} as="div" className="dsp-card-demo">
        <Stat
          size={size}
          label="Cierres"
          value={trend === 'up' ? 8 : 6}
          unit="/ 10"
          delta={trend === 'up' ? 2 : -1}
          deltaLabel={trend === 'up' ? '+2 vs septiembre' : '−1 vs agosto'}
          caption="Meta mensual de 10"
        />
      </Card>
    </Specimen>
  );
}

function OverlaysSpecimen() {
  const notify = useToast();
  const [drawer, setDrawer] = useState(false);
  const [popover, setPopover] = useState(false);
  const popoverAnchor = useRef(null);
  return (
    <Specimen
      id="capas"
      title="Capas y confirmaciones"
      description="Panel lateral con foco atrapado, popover anclado (hoja inferior en móvil) y avisos no bloqueantes anunciados a lectores de pantalla."
    >
      <div className="dsp-row">
        <Button variant="primary" onClick={() => setDrawer(true)}>
          Abrir panel
        </Button>
        <Button ref={popoverAnchor} aria-expanded={popover} onClick={() => setPopover(p => !p)}>
          Abrir popover
        </Button>
        <Button variant="ghost" icon={IconCheck} onClick={() => notify('Cambios guardados.')}>
          Aviso de éxito
        </Button>
        <Button variant="ghost" icon={IconBell} onClick={() => notify('Hay 2 negociaciones por revisar.', {tone: 'info'})}>
          Aviso informativo
        </Button>
      </div>

      <Popover open={popover} anchor={popoverAnchor.current} label="Menú de ejemplo" onClose={() => setPopover(false)}>
        <MenuSection title="Cuenta">
          <MenuItem icon={IconUser} label="Opción interactiva" onClick={() => setPopover(false)} />
          <MenuItem icon={IconFile} label="Con valor" value="CSV" disabled />
        </MenuSection>
        <MenuSection>
          <MenuItem icon={IconLogOut} label="Acción destructiva" tone="danger" disabled />
        </MenuSection>
      </Popover>

      <Drawer
        open={drawer}
        eyebrow="Componente"
        title="Panel lateral"
        onClose={() => setDrawer(false)}
        footer={
          <Button variant="primary" className="dsp-full" onClick={() => setDrawer(false)}>
            Entendido
          </Button>
        }
      >
        <p className="dsp-muted">
          Se cierra con Escape, clic fuera o el botón. El foco queda atrapado dentro y vuelve al botón que lo abrió. En móvil se abre desde
          abajo.
        </p>
      </Drawer>
    </Specimen>
  );
}

function FeedbackSpecimen() {
  return (
    <Specimen
      id="estados"
      title="Estados, menú y avatar"
      description="Carga con brillo animado, estado vacío con salida, filas de menú y avatares de 24 / 32 / 40 px."
    >
      <div className="dsp-grid-3">
        <div className="dsp-stack">
          <span className="ds-eyebrow">Carga</span>
          <Skeleton width="60%" height={16} />
          <Skeleton height={80} radius={16} />
        </div>
        <div className="dsp-surface">
          <EmptyState
            icon={IconSearch}
            title="Sin resultados"
            description="Ninguna oportunidad coincide."
            action={<Button size="sm">Limpiar filtros</Button>}
          />
        </div>
        <div className="dsp-stack">
          <span className="ds-eyebrow">Menú</span>
          <div className="dsp-surface dsp-surface--tight">
            <MenuItem icon={IconSparkles} label="Con control" control={<Badge tone="accent">Nuevo</Badge>} />
            <MenuItem icon={IconFile} label="Con valor" value="CSV" disabled />
          </div>
          <span className="ds-eyebrow">Avatar</span>
          <div className="dsp-row">
            <Avatar name="Ana López" size={24} />
            <Avatar name="Carlos Ruiz" size={32} />
            <Avatar name="Laura Díaz" size={40} />
          </div>
        </div>
      </div>
    </Specimen>
  );
}

function CheckboxSpecimen() {
  const [items, setItems] = useState({a: true, b: false});
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };
  return (
    <Specimen
      id="casilla"
      title="Checkbox y botón con carga"
      description="Casilla nativa con piel propia (objetivo de 48 px) y botón con estado de carga: se deshabilita y anuncia aria-busy mientras espera."
    >
      <div className="dsp-grid-2">
        <div className="dsp-surface dsp-surface--tight">
          <Checkbox
            label="Horno apagado"
            description="Con descripción opcional."
            checked={items.a}
            onChange={v => setItems(s => ({...s, a: v}))}
          />
          <Checkbox label="Puerta del cuarto frío cerrada" checked={items.b} onChange={v => setItems(s => ({...s, b: v}))} />
        </div>
        <div className="dsp-row">
          <Button variant="primary" loading={saving} onClick={save}>
            Guardar
          </Button>
          <Button loading>Cargando</Button>
        </div>
      </div>
    </Specimen>
  );
}

export function ComponentsSection({theme, onToggleTheme}) {
  return (
    <section className="dsp-section" aria-labelledby="componentes">
      <h2 id="componentes" className="dsp-section__title">
        Componentes
      </h2>
      <ButtonSpecimen />
      <div className="dsp-grid-2">
        <BadgeSpecimen />
        <SwitchTooltipSpecimen theme={theme} onToggleTheme={onToggleTheme} />
      </div>
      <FieldsSpecimen />
      <StatCardSpecimen />
      <OverlaysSpecimen />
      <FeedbackSpecimen />
      <CheckboxSpecimen />
    </section>
  );
}
