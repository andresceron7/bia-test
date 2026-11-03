import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Button} from './Button';
import {IconClose} from '../icons';

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Capa modal. placement: side (panel lateral) | center (ventana centrada).
 * Atrapa el foco, cierra con Escape o clic fuera y devuelve el foco al elemento que lo abrió.
 * En móvil ambas variantes se abren como hoja inferior.
 */
export function Drawer({open, title, eyebrow, onClose, children, footer, placement = 'side'}) {
  const panel = useRef(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  // Monta → anima entrada; al cerrar anima salida y luego desmonta
  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const timer = setTimeout(() => panel.current?.querySelector(FOCUSABLE)?.focus(), 30);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open]);

  if (!mounted) return null;

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
    if (e.key !== 'Tab') return;
    const items = [...panel.current.querySelectorAll(FOCUSABLE)];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="ds-drawer" data-visible={visible} data-placement={placement} onKeyDown={onKeyDown}>
      <div className="ds-drawer__scrim" onClick={onClose} aria-hidden="true" />
      <aside ref={panel} className="ds-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="ds-drawer-title">
        <header className="ds-drawer__header">
          <div>
            {eyebrow && <span className="ds-eyebrow">{eyebrow}</span>}
            <h2 id="ds-drawer-title" className="ds-drawer__title">
              {title}
            </h2>
          </div>
          <Button variant="ghost" icon={IconClose} iconOnly label="Cerrar detalle" tooltipSide="bottom" onClick={onClose} />
        </header>
        <div className="ds-drawer__body">{children}</div>
        {footer && <footer className="ds-drawer__footer">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}
