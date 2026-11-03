import {useState} from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  formatMillions,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconSearch,
} from '../../design-system';
import {contactDay} from './model';
import {StageTrack} from './StageTrack';

const SORTERS = {
  value: (a, b) => a.value - b.value,
  contact: (a, b) => contactDay(a) - contactDay(b),
};

function SortHeader({id, sort, onSort, children}) {
  const active = sort.key === id;
  const Icon = active && sort.dir === 'asc' ? IconChevronUp : IconChevronDown;
  return (
    <th aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="olb-table__sort" data-active={active} onClick={() => onSort(id)}>
        {children}
        <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </th>
  );
}

export function OpportunityTable({opportunities, onOpen, isDone, onClear}) {
  const [sort, setSort] = useState({key: null, dir: 'desc'});
  const onSort = key =>
    setSort(s => (s.key !== key ? {key, dir: key === 'contact' ? 'asc' : 'desc'} : {key, dir: s.dir === 'asc' ? 'desc' : 'asc'}));

  const rows = sort.key ? [...opportunities].sort((a, b) => SORTERS[sort.key](a, b) * (sort.dir === 'asc' ? 1 : -1)) : opportunities;

  return (
    <Card
      title="Oportunidades abiertas"
      eyebrow="Selecciona una para ver el detalle"
      className="olb-table-card"
      style={{'--enter-delay': '360ms'}}
    >
      {rows.length ? (
        <div className="olb-table-scroll">
          <table className="olb-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Etapa</th>
                <SortHeader id="value" sort={sort} onSort={onSort}>
                  Valor mensual
                </SortHeader>
                <th>Responsable</th>
                <SortHeader id="contact" sort={sort} onSort={onSort}>
                  Próximo contacto
                </SortHeader>
                <th>
                  <span className="sr-only">Seguimiento</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(o => (
                <tr key={o.company} onClick={() => onOpen(o)}>
                  <td data-label="Empresa">
                    <button type="button" className="olb-table__company" onClick={e => (e.stopPropagation(), onOpen(o))}>
                      {o.company}
                      <span className="sr-only">, ver detalle</span>
                    </button>
                  </td>
                  <td data-label="Etapa">
                    <StageTrack stage={o.stage} />
                  </td>
                  <td data-label="Valor mensual" className="ds-tabular olb-table__value">
                    {formatMillions(o.value)}
                  </td>
                  <td data-label="Responsable">
                    <span className="olb-table__owner">
                      <Avatar name={o.owner} size={24} />
                      {o.owner}
                    </span>
                  </td>
                  <td data-label="Próximo contacto" className="ds-tabular">
                    {o.nextContact}
                  </td>
                  <td className="olb-table__status">
                    {isDone(o) && (
                      <Badge tone="success" icon={IconCircleCheck}>
                        Seguimiento
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={IconSearch}
          title="No se encontraron oportunidades"
          description="Ninguna oportunidad coincide con la combinación de filtros y búsqueda actual."
          action={
            onClear && (
              <Button variant="secondary" onClick={onClear}>
                Limpiar filtros
              </Button>
            )
          }
        />
      )}
    </Card>
  );
}
