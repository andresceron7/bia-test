import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Avatar,
  Badge,
  Button,
  IconArrowRight,
  IconChevronUp,
  IconClients,
  IconDashboard,
  IconDownload,
  IconHelp,
  IconMenu,
  IconOpportunities,
  IconReports,
  IconSettings,
  IconTeam,
  MonthPicker,
  ProfileMenu,
  Sidebar,
  ToastProvider,
  Tooltip,
  usePersistentState,
  useMediaQuery,
  useTheme,
  useToast,
} from '../../design-system';
import {data} from './data';
import {filterRows} from './filters';
import {EMPTY_FILTERS, PERIOD_YEAR, PERIODS, toCSV, toOpportunity} from './model';
import {Banner} from './Banner';
import {ResultsSection} from './ResultsSection';
import {PipelineSection} from './PipelineSection';
import {OpportunityDrawer} from './OpportunityDrawer';
import {DashboardSkeleton} from './DashboardSkeleton';
import {SettingsMenu} from './SettingsMenu';
import {goToProfile, PROFILES} from '../profiles';
import './olibia.css';

const NAV = [
  {id: 'dashboard', label: 'Dashboard', icon: IconDashboard},
  {id: 'opportunities', label: 'Oportunidades', icon: IconOpportunities},
  {id: 'clients', label: 'Clientes', icon: IconClients, soon: true},
  {id: 'team', label: 'Equipo', icon: IconTeam, soon: true},
  {id: 'reports', label: 'Reportes', icon: IconReports, soon: true},
];
const NAV_FOOTER = [
  {id: 'settings', label: 'Configuración', icon: IconSettings, popup: true},
  {id: 'help', label: 'Ayuda', icon: IconHelp, soon: true},
];

// Tiempo de carga simulado al cambiar de periodo, para mostrar el estado de carga
const LOAD_MS = 650;

function Dashboard() {
  const {theme, toggle} = useTheme();
  const notify = useToast();
  const [collapsed, setCollapsed] = usePersistentState('olibia.sidebar.collapsed', false);
  const [mobileNav, setMobileNav] = useState(false);
  // En tablet el menú vive colapsado y, al expandirse, flota sobre el contenido
  const tablet = useMediaQuery('(min-width: 721px) and (max-width: 1024px)');
  const [tabletOpen, setTabletOpen] = useState(false);
  const mobile = useMediaQuery('(max-width: 720px)');
  const sidebarCollapsed = tablet ? !tabletOpen : collapsed;
  const toggleSidebar = () => (tablet ? setTabletOpen(o => !o) : setCollapsed(c => !c));
  const [period, setPeriod] = useState('oct');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selected, setSelected] = useState(null);
  const [followUps, setFollowUps] = useState({});
  const [banner, setBanner] = useState(true);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const pipelineRef = useRef(null);

  const periodInfo = PERIODS.find(p => p.value === period);
  const d = data[period];
  const opportunities = useMemo(() => filterRows(d.rows, filters).map(row => toOpportunity(row, d.rows)), [d, filters]);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), LOAD_MS);
    return () => clearTimeout(t);
  }, [loading]);

  const changePeriod = value => {
    if (value === period) return;
    setPeriod(value);
    setLoading(true);
  };

  const updateFilter = useCallback((key, value) => setFilters(f => ({...f, [key]: value})), []);
  const toggleFilter = useCallback((key, value) => setFilters(f => ({...f, [key]: f[key] === value ? '' : value})), []);
  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const scrollToPipeline = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pipelineRef.current?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
  };

  const showNegotiations = () => {
    setFilters({...EMPTY_FILTERS, stage: 'Negociación'});
    scrollToPipeline();
  };

  const exportCSV = () => {
    if (!opportunities.length) {
      notify('No hay oportunidades para exportar con estos filtros.', {tone: 'info'});
      return;
    }
    const blob = new Blob([toCSV(opportunities)], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `olibia-${period}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify(`CSV exportado con ${opportunities.length} ${opportunities.length === 1 ? 'oportunidad' : 'oportunidades'}.`);
  };

  const followUpKey = o => `${period}:${o.company}`;
  // La confirmación se muestra dentro del panel de detalle, no como aviso flotante
  const setFollowUp = (o, done) => setFollowUps(f => ({...f, [followUpKey(o)]: done}));

  const onNav = (item, element) => {
    if (item.id === 'settings') {
      setSettingsAnchor(a => (a ? null : element));
      return;
    }
    setMobileNav(false);
    if (item.id === 'opportunities') scrollToPipeline();
    else if (item.id === 'dashboard') window.scrollTo({top: 0, behavior: 'smooth'});
    else notify(`${item.label} estará disponible pronto.`, {tone: 'info'});
  };

  return (
    <div className="olb" data-collapsed={tablet || collapsed}>
      <a
        className="olb-skip"
        href="#contenido"
        onClick={e => {
          // Las rutas usan el hash: movemos el foco sin cambiar la URL
          e.preventDefault();
          document.getElementById('contenido')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <Sidebar
        brand={
          <span className="olb-brand">
            <span className="olb-brand__mark" aria-hidden="true" />
            <span className="olb-brand__word">olibia</span>
          </span>
        }
        items={NAV}
        footerItems={NAV_FOOTER}
        activeId="dashboard"
        expandedId={settingsAnchor ? 'settings' : null}
        onSelect={onNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        floating={tablet}
        mobileOpen={mobileNav}
        onMobileClose={() => setMobileNav(false)}
        footer={
          <Tooltip content={sidebarCollapsed && !mobile ? 'Cambiar de perfil' : null} side="right">
            <button
              type="button"
              className="olb-team"
              aria-haspopup="dialog"
              aria-expanded={Boolean(profileAnchor)}
              aria-label="Perfil comercial, Tarea 1. Cambiar de perfil"
              onClick={e => {
                const el = e.currentTarget;
                setProfileAnchor(a => (a ? null : el));
              }}
            >
              <Avatar name="Equipo Comercial" size={32} />
              <span className="olb-team__text">
                <strong>Equipo comercial</strong>
                <Badge tone="glass">Tarea 1</Badge>
              </span>
              <IconChevronUp className="olb-team__chevron" size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </Tooltip>
        }
      />

      <div className="olb-main">
        <header className="olb-topbar">
          <div className="olb-topbar__title">
            <Button
              className="olb-menu-btn"
              variant="ghost"
              icon={IconMenu}
              iconOnly
              label="Abrir menú"
              onClick={() => setMobileNav(true)}
            />
            <div>
              <span className="ds-eyebrow">Gestión comercial · {periodInfo.long}</span>
              <h1>Dashboard comercial</h1>
            </div>
          </div>
          <div className="olb-topbar__actions">
            <MonthPicker
              year={PERIOD_YEAR}
              value={periodInfo.month}
              available={PERIODS.map(p => p.month)}
              onChange={month => changePeriod(PERIODS.find(p => p.month === month).value)}
            />
            <Button
              variant="secondary"
              icon={IconDownload}
              iconOnly
              label="Exportar CSV de oportunidades filtradas"
              tooltipSide="bottom-end"
              onClick={exportCSV}
              disabled={loading}
            />
          </div>
        </header>

        <main id="contenido" className="olb-content" aria-busy={loading} tabIndex={-1}>
          {banner && <Banner onAction={showNegotiations} onClose={() => setBanner(false)} />}
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div key={period} className="olb-stack">
              <ResultsSection data={d} period={periodInfo} />
              <PipelineSection
                ref={pipelineRef}
                opportunities={opportunities}
                filters={filters}
                onFilter={updateFilter}
                onToggleFilter={toggleFilter}
                onClear={clearFilters}
                onShowNegotiations={showNegotiations}
                onOpen={setSelected}
                isDone={o => Boolean(followUps[followUpKey(o)])}
              />
            </div>
          )}
          <footer className="olb-foot">
            <span>Datos ficticios para el ejercicio de diseño · Sin conexión a sistemas de Bia/Olibia</span>
            <a className="ds-button ds-button--primary ds-button--sm" href="#/design-system">
              <span>
                Ver Design System (módulo extra)
                <IconArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </a>
          </footer>
        </main>
      </div>

      <ProfileMenu
        open={Boolean(profileAnchor)}
        anchor={profileAnchor}
        boundary={profileAnchor?.closest('.ds-sidebar')}
        placement="right-end"
        profiles={PROFILES}
        currentId="comercial"
        onSelect={goToProfile}
        onClose={() => setProfileAnchor(null)}
      />

      <SettingsMenu
        open={Boolean(settingsAnchor)}
        anchor={settingsAnchor}
        boundary={settingsAnchor?.closest('.ds-sidebar')}
        theme={theme}
        onToggleTheme={toggle}
        onClose={() => setSettingsAnchor(null)}
      />

      <OpportunityDrawer
        opportunity={selected}
        period={periodInfo}
        done={selected ? Boolean(followUps[followUpKey(selected)]) : false}
        onFollowUp={done => setFollowUp(selected, done)}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default function OlibiaApp() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
