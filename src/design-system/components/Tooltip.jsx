import {cloneElement, useId, useState} from 'react';

/**
 * Tooltip que aparece con hover y con foco de teclado.
 * Solo complementa: la información esencial nunca depende de él.
 * Se monta solo mientras está abierto, así nunca ocupa espacio ni desborda la página.
 */
export function Tooltip({content, side = 'top', children}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  if (!content) return children;
  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  return (
    <span
      className="ds-tooltip-anchor"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={e => e.key === 'Escape' && hide()}
    >
      {cloneElement(children, {'aria-describedby': open ? id : undefined})}
      {open && (
        <span id={id} role="tooltip" className={`ds-tooltip ds-tooltip--${side}`}>
          {content}
        </span>
      )}
    </span>
  );
}
