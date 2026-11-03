import {Skeleton} from '../../design-system';

export function DashboardSkeleton() {
  return (
    <div className="olb-stack" role="status">
      <span className="sr-only">Cargando datos del periodo…</span>
      <div className="olb-section">
        <Skeleton width={220} height={22} />
        <div className="olb-grid olb-grid--results">
          {[0, 1, 2].map(i => (
            <div key={i} className="ds-card olb-skeleton-card">
              <Skeleton width="40%" height={12} />
              <Skeleton height={160} radius={14} />
            </div>
          ))}
        </div>
      </div>
      <div className="olb-section">
        <Skeleton width={180} height={22} />
        <div className="ds-card olb-skeleton-card">
          <Skeleton height={44} radius={12} />
        </div>
        <div className="olb-grid olb-grid--summary">
          {[0, 1].map(i => (
            <div key={i} className="ds-card olb-skeleton-card">
              <Skeleton width="30%" height={12} />
              <Skeleton height={90} radius={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
