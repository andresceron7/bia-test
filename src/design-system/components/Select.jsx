import {useId} from 'react';
import {IconChevronDown} from '../icons';

/**
 * Select nativo con piel propia: conserva accesibilidad y el selector del sistema en móvil.
 * Se marca como activo cuando tiene un valor distinto al vacío.
 */
export function Select({label, value, onChange, options, placeholder}) {
  const id = useId();
  return (
    <div className="ds-select" data-active={value !== ''}>
      <label htmlFor={id} className="ds-select__label">
        {label}
      </label>
      <div className="ds-select__control">
        <select id={id} value={value} onChange={e => onChange(e.target.value)}>
          <option value="">{placeholder}</option>
          {options.map(option => {
            const {value: v, label: l} = typeof option === 'string' ? {value: option, label: option} : option;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
        <IconChevronDown size={16} strokeWidth={1.6} aria-hidden="true" />
      </div>
    </div>
  );
}
