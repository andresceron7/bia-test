import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

const FOCUSABLE = 'button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])';
const GAP = 10;

/**
 * Capa flotante anclada a un elemento.
 * placement: bottom-end (bajo el ancla, alineada a la derecha) | right-end (a la derecha, alineada abajo).
 * `boundary` permite tomar el borde de un contenedor (p. ej. el menú lateral) en lugar del ancla.
 * En pantallas pequeñas se convierte en hoja inferior. Cierra con Escape o clic fuera y devuelve el foco.
 */
export function Popover({open, anchor, boundary, placement = 'bottom-end', label, onClose, children, className = ''}) {
  const panel = useRef(null);
  const [position, setPosition] = useState(null);
  const close = useRef(onClose);
  close.current = onClose;

  useLayoutEffect(() => {
    if (!open || !anchor) return setPosition(null);
    const place = () => {
      const a = anchor.getBoundingClientRect();
      const edge = (boundary ?? anchor).getBoundingClientRect();
      setPosition(
        placement === 'right-end'
          ? {left: edge.right + GAP, bottom: Math.max(window.innerHeight - a.bottom, GAP)}
          : {top: a.bottom + GAP, right: Math.max(window.innerWidth - a.right, GAP)},
      );
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, anchor, boundary, placement]);

  const ready = Boolean(position);
  useEffect(() => {
    if (!open || !ready) return;
    const focusTarget = panel.current?.querySelector('[data-autofocus]') ?? panel.current?.querySelector(FOCUSABLE);
    focusTarget?.focus();
    const onKey = e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close.current();
        anchor?.focus();
      }
    };
    const onPointer = e => {
      if (!panel.current?.contains(e.target) && !anchor?.contains(e.target)) close.current();
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, ready, anchor]);

  if (!open || !position) return null;

  return createPortal(
    <>
      <div className="ds-popover-scrim" aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-label={label}
        className={`ds-popover ds-popover--${placement} ${className}`}
        style={position}
        onBlur={e => {
          // Al salir con Tab fuera del panel, se cierra
          if (e.relatedTarget && !panel.current.contains(e.relatedTarget) && e.relatedTarget !== anchor) close.current();
        }}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
