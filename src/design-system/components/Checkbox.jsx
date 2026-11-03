import {useId} from 'react';
import {IconCheck} from '../icons';

/** Casilla nativa con piel propia: conserva teclado, foco y lectura del sistema. */
export function Checkbox({label, description, checked, onChange, disabled}) {
  const id = useId();
  return (
    <label className="ds-checkbox" htmlFor={id} data-checked={checked} data-disabled={disabled || undefined}>
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} />
      <span className="ds-checkbox__box" aria-hidden="true">
        <IconCheck size={16} strokeWidth={2.4} />
      </span>
      <span className="ds-checkbox__text">
        <span className="ds-checkbox__label">{label}</span>
        {description && <span className="ds-checkbox__description">{description}</span>}
      </span>
    </label>
  );
}
