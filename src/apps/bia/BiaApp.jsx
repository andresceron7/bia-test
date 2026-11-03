import {useEffect, useRef, useState} from 'react';
import {Avatar, Badge, IconBolt, IconChevronDown, ProfileMenu, Skeleton, ThemeSwitch, ToastProvider, useTheme} from '../../design-system';
import {goToProfile, PROFILES} from '../profiles';
import {Comparison} from './Comparison';
import {Breakdown} from './Breakdown';
import {SiteExplorer} from './SiteExplorer';
import {NextSteps} from './NextSteps';
import './bia.css';

// Tiempo simulado de análisis de la factura al entrar
const LOAD_MS = 900;

function LoadingState() {
  return (
    <div className="bia-loading" role="status">
      <span className="bia-loading__label">
        <IconBolt size={20} strokeWidth={1.8} aria-hidden="true" />
        Analizando tu factura de octubre…
      </span>
      <Skeleton width="70%" height={48} radius={16} />
      <Skeleton width="50%" height={24} radius={8} />
      <div className="bia-loading__grid">
        <Skeleton height={240} radius={24} />
        <Skeleton height={240} radius={24} />
      </div>
    </div>
  );
}

function Experience() {
  const {theme, toggle} = useTheme();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState('chapinero');
  const [profileAnchor, setProfileAnchor] = useState(null);
  const whyRef = useRef(null);
  const sitesRef = useRef(null);
  const stepsRef = useRef(null);

  useEffect(() => {
    document.title = 'Bia · Tu factura de energía';
    const t = setTimeout(() => setLoading(false), LOAD_MS);
    return () => {
      clearTimeout(t);
      document.title = 'Olibia · Gestión comercial';
    };
  }, []);

  const scrollTo = ref => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ref.current?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
    // Lleva el foco al título de la sección para lectores de pantalla y teclado
    ref.current?.querySelector('h2')?.focus({preventScroll: true});
  };

  const exploreDriver = d => {
    setSite(d.site);
    scrollTo(sitesRef);
  };

  return (
    <div className="bia">
      <a
        className="bia-skip"
        href="#bia-main"
        onClick={e => {
          e.preventDefault();
          document.getElementById('bia-main')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className="bia-top">
        <span className="bia-brand">
          <span className="bia-brand__mark" aria-hidden="true">
            <IconBolt size={20} strokeWidth={2} />
          </span>
          <span className="bia-brand__word">bia</span>
        </span>
        <div className="bia-top__right">
          <ThemeSwitch theme={theme} onToggle={toggle} />
          <button
            type="button"
            className="bia-user"
            aria-haspopup="dialog"
            aria-expanded={Boolean(profileAnchor)}
            aria-label="Perfil cliente, Marcela Vargas, Tarea 2. Cambiar de perfil"
            onClick={e => {
              const el = e.currentTarget;
              setProfileAnchor(a => (a ? null : el));
            }}
          >
            <Avatar name="Marcela Vargas" size={32} />
            <span className="bia-user__text">
              <strong>Marcela Vargas</strong>
              <small>Café Aurora · 3 sedes</small>
            </span>
            <Badge tone="glass">Tarea 2</Badge>
            <IconChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <ProfileMenu
            open={Boolean(profileAnchor)}
            anchor={profileAnchor}
            profiles={PROFILES}
            currentId="cliente"
            onSelect={goToProfile}
            onClose={() => setProfileAnchor(null)}
          />
        </div>
      </header>

      <main id="bia-main" className="bia-main" tabIndex={-1} aria-busy={loading}>
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <Comparison onWhatToDo={() => scrollTo(stepsRef)} />
            <Breakdown onExplore={exploreDriver} sectionRef={whyRef} />
            <SiteExplorer siteId={site} onSite={setSite} sectionRef={sitesRef} onWhatToDo={() => scrollTo(stepsRef)} />
            <NextSteps sectionRef={stepsRef} />
          </>
        )}
        <footer className="bia-foot">
          <span>Escenario ficticio para la prueba de diseño · Los datos y acciones son simulados.</span>
          <a href="#/design-system">Design System</a>
        </footer>
      </main>
    </div>
  );
}

export default function BiaApp() {
  return (
    <ToastProvider>
      <Experience />
    </ToastProvider>
  );
}
