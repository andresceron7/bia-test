import {IconClose, IconSearch} from '../icons';

export function SearchField({label, value, onChange, placeholder}) {
  return (
    <div className="ds-search">
      <IconSearch size={16} strokeWidth={1.6} aria-hidden="true" />
      <input type="search" aria-label={label} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      {value && (
        <button type="button" className="ds-search__clear" aria-label="Borrar búsqueda" onClick={() => onChange('')}>
          <IconClose size={16} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
