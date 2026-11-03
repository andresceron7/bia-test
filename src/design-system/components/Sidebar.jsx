import {useEffect, useRef} from 'react';
import {Tooltip} from './Tooltip';
import {useMediaQuery} from '../hooks';
import {IconChevronLeft, IconChevronRight, IconClose} from '../icons';

/**
 * Navegación lateral de vidrio líquido, sin bordes.
 * Desktop y tablet: colapsable con una pestaña fija en el borde derecho (solo iconos + tooltips).
 * Con `floating` (tablet), al expandirse flota sobre el contenido y se cierra al tocar fuera.
 * Móvil: panel deslizable sobre el contenido.
 * Un ítem con `popup` abre una capa (p. ej. Configuración) y expone su estado con aria-expanded.
 */
export function Sidebar({
  brand,
  items,
  footerItems = [],
  activeId,
  expandedId,
  onSelect,
  collapsed: collapsedPref,
  onToggleCollapse,
  floating = false,
  mobileOpen,
  onMobileClose,
  footer,
}) {
  const nav = useRef(null);
  // En móvil el panel siempre se muestra completo
  const mobile = useMediaQuery('(max-width: 720px)');
  const collapsed = collapsedPref && !mobile;

  const close = useRef(onMobileClose);
  close.current = onMobileClose;
  const overlay = floating && !mobile && !collapsed;

  const toggle = useRef(onToggleCollapse);
  toggle.current = onToggleCollapse;
  useEffect(() => {
    if (!overlay) return;
    const onKey = e => e.key === 'Escape' && toggle.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay]);

  useEffect(() => {
    if (!mobileOpen) return;
    nav.current?.querySelector('button')?.focus();
    const onKey = e => e.key === 'Escape' && close.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const renderItem = item => {
    const Icon = item.icon;
    const active = item.id === activeId;
    return (
      <li key={item.id}>
        <Tooltip content={collapsed ? item.label : null} side="right">
          <button
            type="button"
            className="ds-nav__item"
            aria-current={active ? 'page' : undefined}
            aria-haspopup={item.popup ? 'dialog' : undefined}
            aria-expanded={item.popup ? item.id === expandedId : undefined}
            aria-label={collapsed ? item.label : undefined}
            onClick={e => onSelect(item, e.currentTarget)}
          >
            <span className="ds-nav__icon">
              <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <span className="ds-nav__label">{item.label}</span>
            {item.soon && <span className="ds-nav__soon">Pronto</span>}
          </button>
        </Tooltip>
      </li>
    );
  };

  return (
    <>
      <div
        className="ds-sidebar-scrim"
        data-open={mobileOpen || overlay}
        onClick={overlay ? onToggleCollapse : onMobileClose}
        aria-hidden="true"
      />
      <aside
        className="ds-sidebar"
        data-collapsed={collapsed}
        data-floating={overlay}
        data-mobile-open={mobileOpen}
        inert={mobile && !mobileOpen}
      >
        <div className="ds-sidebar__glass" aria-hidden="true" />
        <div className="ds-sidebar__brand">
          <div className="ds-sidebar__logo">{brand}</div>
          {mobile && (
            <button type="button" className="ds-sidebar__toggle" aria-label="Cerrar menú" onClick={onMobileClose}>
              <IconClose size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
          )}
        </div>
        <nav ref={nav} className="ds-nav" aria-label="Menú principal">
          <ul>{items.map(renderItem)}</ul>
          <ul className="ds-nav__footer">{footerItems.map(renderItem)}</ul>
        </nav>
        {footer && <div className="ds-sidebar__footer">{footer}</div>}
        {!mobile && (
          <button
            type="button"
            className="ds-sidebar__tab"
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            aria-expanded={!collapsed}
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <IconChevronRight size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <IconChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        )}
      </aside>
    </>
  );
}
