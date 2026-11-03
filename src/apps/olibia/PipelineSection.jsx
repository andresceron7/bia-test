import {
  Badge,
  BarList,
  Button,
  Card,
  formatMillions,
  IconFilterOff,
  IconSparkles,
  SearchField,
  Select,
  ShareBar,
  Stat,
} from '../../design-system';
import {CHANNELS, OWNERS, STAGES, sumValue, VALUE_OPTIONS} from './model';
import {OpportunityTable} from './OpportunityTable';

/**
 * Pipeline abierto: todo lo que hay aquí responde a los filtros.
 * Las gráficas de etapa y canal también funcionan como filtros.
 */
export function PipelineSection({ref, opportunities, filters, onFilter, onToggleFilter, onClear, onShowNegotiations, onOpen, isDone}) {
  const active = Object.values(filters).filter(Boolean).length;
  const total = sumValue(opportunities);
  const negotiation = opportunities.filter(o => o.stage === 'Negociación');
  const stages = STAGES.map(stage => {
    const list = opportunities.filter(o => o.stage === stage);
    return {id: stage, label: stage, value: list.length, secondary: list.length ? formatMillions(sumValue(list)) : null};
  });
  const channels = CHANNELS.map(channel => ({
    id: channel,
    label: channel,
    value: opportunities.filter(o => o.channel === channel).length,
  }));

  return (
    <section ref={ref} className="olb-section olb-section--anchor" aria-labelledby="pipeline-title">
      <div className="olb-section__head">
        <h2 id="pipeline-title">Pipeline abierto</h2>
        {active ? (
          <Badge tone="accent" dot>
            {active} {active === 1 ? 'filtro activo' : 'filtros activos'}
          </Badge>
        ) : (
          <Badge tone="neutral">Responde a los filtros</Badge>
        )}
      </div>

      <Card className="olb-filters" as="div" style={{'--enter-delay': '160ms'}}>
        <div className="olb-filters__grid">
          <Select label="Etapa" placeholder="Todas" value={filters.stage} onChange={v => onFilter('stage', v)} options={STAGES} />
          <Select label="Responsable" placeholder="Todos" value={filters.owner} onChange={v => onFilter('owner', v)} options={OWNERS} />
          <Select label="Canal" placeholder="Todos" value={filters.channel} onChange={v => onFilter('channel', v)} options={CHANNELS} />
          <Select
            label="Valor mensual"
            placeholder="Cualquier valor"
            value={filters.minimum}
            onChange={v => onFilter('minimum', v)}
            options={VALUE_OPTIONS}
          />
          <div className="olb-filters__search">
            <SearchField label="Buscar empresa" placeholder="Buscar empresa" value={filters.query} onChange={v => onFilter('query', v)} />
          </div>
          <Button variant="ghost" icon={IconFilterOff} onClick={onClear} disabled={!active}>
            Limpiar
          </Button>
        </div>
        <p className="olb-filters__result" aria-live="polite">
          {opportunities.length} {opportunities.length === 1 ? 'oportunidad coincide' : 'oportunidades coinciden'}
        </p>
      </Card>

      <div className="olb-grid olb-grid--summary">
        <div className="olb-column">
          <Card className="olb-kpis" as="div" style={{'--enter-delay': '200ms'}}>
            <Stat label="Oportunidades abiertas" value={opportunities.length} caption="Según los filtros" />
            <Stat label="Valor del pipeline" value={formatMillions(total)} caption="COP / mes" />
            <Stat
              label="En negociación"
              value={negotiation.length}
              caption={negotiation.length ? `${formatMillions(sumValue(negotiation))} en juego` : 'Sin negociaciones visibles'}
            />
          </Card>
          <Card title="Oportunidades por etapa" eyebrow="Toca una etapa para filtrar" style={{'--enter-delay': '280ms'}}>
            <BarList
              rows={stages}
              max={Math.max(opportunities.length, 1)}
              onSelect={id => onToggleFilter('stage', id)}
              activeId={filters.stage}
            />
          </Card>
        </div>

        <div className="olb-column">
          <Card
            className="olb-ai"
            title="Resumen AI"
            eyebrow={
              <span className="olb-ai__eyebrow">
                <IconSparkles size={16} strokeWidth={1.7} aria-hidden="true" /> Asistente
              </span>
            }
            scope={<Badge tone="neutral">Demostración</Badge>}
            aria-label="Resumen AI"
            style={{'--enter-delay': '240ms'}}
          >
            <div className="olb-ai__body" aria-live="polite">
              {opportunities.length ? (
                <>
                  <p>
                    Hay <strong>{opportunities.length} oportunidades abiertas</strong> en esta vista, por un valor mensual estimado de{' '}
                    <strong>{formatMillions(total)} COP</strong>.{' '}
                    {negotiation.length
                      ? `${negotiation.length} ${negotiation.length === 1 ? 'está' : 'están'} en negociación y concentran ${formatMillions(sumValue(negotiation))} del pipeline.`
                      : 'Ninguna de las oportunidades visibles está en negociación.'}
                  </p>
                  <div className="olb-ai__next">
                    <span className="ds-eyebrow">Siguiente paso sugerido</span>
                    <p>
                      Revisar {negotiation.length ? 'las negociaciones pendientes' : 'las próximas fechas de contacto'} y confirmar
                      responsables.
                    </p>
                    {negotiation.length > 0 && filters.stage !== 'Negociación' && (
                      <Button size="sm" variant="secondary" onClick={onShowNegotiations}>
                        Ver negociaciones
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <p>No hay oportunidades con estos filtros. Prueba ampliando la selección.</p>
              )}
            </div>
            <p className="olb-note">Resumen simulado a partir de los datos visibles; no utiliza un servicio de AI.</p>
          </Card>
          <Card title="Origen de oportunidades" eyebrow="Toca un canal para filtrar" style={{'--enter-delay': '320ms'}}>
            <ShareBar segments={channels} onSelect={id => onToggleFilter('channel', id)} activeId={filters.channel} />
          </Card>
        </div>
      </div>

      <OpportunityTable opportunities={opportunities} onOpen={onOpen} isDone={isDone} onClear={active ? onClear : null} />
    </section>
  );
}
