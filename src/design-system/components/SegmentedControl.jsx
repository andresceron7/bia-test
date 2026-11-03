import {useRef} from 'react';

/**
 * Control segmentado (grupo de radios) con indicador deslizante.
 * Navegable con flechas, como un radiogroup nativo.
 */
export function SegmentedControl({label, options, value, onChange}) {
  const refs = useRef([]);
  const index = Math.max(
    0,
    options.findIndex(o => o.value === value),
  );

  const move = step => {
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="ds-segmented"
      style={{'--count': options.length, '--index': index}}
      onKeyDown={e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          move(1);
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      <span className="ds-segmented__indicator" aria-hidden="true" />
      {options.map((option, i) => (
        <button
          key={option.value}
          ref={el => (refs.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          className="ds-segmented__option"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
