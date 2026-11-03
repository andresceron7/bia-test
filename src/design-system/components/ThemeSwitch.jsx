import {IconMoon, IconSun} from '../icons';

/** Interruptor de tema claro/oscuro con el estado expuesto como switch. */
export function ThemeSwitch({theme, onToggle}) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Modo oscuro"
      className="ds-theme-switch"
      data-dark={dark}
      onClick={onToggle}
    >
      <span className="ds-theme-switch__icon" aria-hidden="true">
        <IconSun size={16} strokeWidth={1.8} />
      </span>
      <span className="ds-theme-switch__icon" aria-hidden="true">
        <IconMoon size={16} strokeWidth={1.8} />
      </span>
      <span className="ds-theme-switch__thumb" aria-hidden="true" />
    </button>
  );
}
