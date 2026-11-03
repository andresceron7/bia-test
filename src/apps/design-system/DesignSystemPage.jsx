import {useEffect} from 'react';
import {IconArrowRight, ThemeSwitch, ToastProvider, useTheme} from '../../design-system';
import {Foundations} from './Foundations';
import {ComponentsSection} from './ComponentsSection';
import {ChartsSection} from './ChartsSection';
import './design-system-page.css';

const INDEX = [
  {
    group: 'Fundamentos',
    items: [
      ['color', 'Color'],
      ['tipografia', 'Tipografía'],
      ['espaciado', 'Espaciado'],
      ['radios', 'Radios y controles'],
      ['iconos', 'Iconografía'],
    ],
  },
  {
    group: 'Componentes',
    items: [
      ['boton', 'Button'],
      ['badge', 'Badge'],
      ['switch', 'Switch y Tooltip'],
      ['campos', 'Campos'],
      ['stat', 'Stat y Card'],
      ['capas', 'Capas'],
      ['estados', 'Estados'],
      ['casilla', 'Checkbox'],
    ],
  },
  {
    group: 'Gráficas',
    items: [
      ['columnas', 'ColumnChart'],
      ['anillo', 'ProgressRing'],
      ['comparacion', 'CompareBars'],
      ['cascada', 'WaterfallChart'],
      ['apiladas', 'StackedBars'],
      ['perfil', 'ProfileChart'],
      ['barlist', 'BarList'],
      ['sharebar', 'ShareBar'],
    ],
  },
];

/**
 * Módulo extra: documentación viva del sistema de diseño.
 * Todo lo que se muestra son los componentes reales del producto, no capturas.
 */
export default function DesignSystemPage() {
  const {theme, toggle} = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Design System · Olibia';
    return () => {
      document.title = 'Olibia · Gestión comercial';
    };
  }, []);

  const goTo = (e, id) => {
    // Las rutas usan el hash: desplazamos sin cambiar la URL y movemos el foco a la ficha
    e.preventDefault();
    const target = document.getElementById(id);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
    target?.focus({preventScroll: true});
  };

  return (
    <ToastProvider>
      <div className="dsp">
        <header className="dsp-top">
          <a className="dsp-back" href="#/olibia">
            <IconArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
            Volver al dashboard
          </a>
          <ThemeSwitch theme={theme} onToggle={toggle} />
        </header>

        <div className="dsp-hero">
          <span className="ds-eyebrow">Olibia · Módulo extra</span>
          <h1>Design System</h1>
          <p>
            Tokens, componentes y gráficas con los que está construido el dashboard. Todo es interactivo y se actualiza con el tema: cambia
            variantes, prueba el teclado y compara el modo claro y oscuro.
          </p>
          <ul className="dsp-principles">
            <li>
              <strong>Retícula de 8 px</strong>
              <span>Espacios, controles e íconos en múltiplos de 8.</span>
            </li>
            <li>
              <strong>WCAG 2.2 AA</strong>
              <span>Texto ≥ 4,5:1 · gráficos ≥ 3:1 · objetivos ≥ 24 px.</span>
            </li>
            <li>
              <strong>Un solo acento</strong>
              <span>Turquesa del rayo de Bia, reservado a lo importante.</span>
            </li>
          </ul>
        </div>

        <div className="dsp-layout">
          <nav className="dsp-index" aria-label="Índice del sistema de diseño">
            {INDEX.map(section => (
              <div key={section.group}>
                <span className="ds-eyebrow">{section.group}</span>
                <ul>
                  {section.items.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`} onClick={e => goTo(e, id)}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <main className="dsp-main">
            <Foundations theme={theme} />
            <ComponentsSection theme={theme} onToggleTheme={toggle} />
            <ChartsSection />
            <footer className="dsp-foot">Olibia Design System · Prueba Design Engineer Bia</footer>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
