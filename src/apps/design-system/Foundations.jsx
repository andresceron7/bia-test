import * as Icons from '../../design-system/icons';
import {Badge} from '../../design-system';
import {COLOR_GROUPS, CONTROLS, RADII, SPACING, TYPE_SCALE} from './tokens';
import {useTokenValues} from './useTokenValues';
import {Specimen} from './Specimen';

const ALL_TOKENS = [
  ...COLOR_GROUPS.flatMap(g => g.tokens.map(t => t.name)),
  ...TYPE_SCALE.map(t => t.name),
  ...SPACING,
  ...RADII,
  ...CONTROLS,
];

const ICONS = Object.entries(Icons).map(([name, Icon]) => ({name: name.replace(/^Icon/, ''), Icon}));

const remToPx = raw => (raw.endsWith('rem') ? `${parseFloat(raw) * 16}px` : raw);

function ContrastBadge({token, value}) {
  if (!value?.ratio || (!token.text && !token.graphic)) return null;
  const min = token.text ? 4.5 : 3;
  const ok = value.ratio >= min;
  return (
    <Badge tone={ok ? 'success' : 'warning'}>
      {value.ratio.toFixed(1)}:1 · {ok ? (token.text ? 'AA texto' : 'AA gráfico') : 'Bajo'}
    </Badge>
  );
}

export function Foundations({theme}) {
  const values = useTokenValues(ALL_TOKENS, theme);

  return (
    <section className="dsp-section" aria-labelledby="fundamentos">
      <h2 id="fundamentos" className="dsp-section__title">
        Fundamentos
      </h2>

      <Specimen
        id="color"
        title="Color"
        description={`Valores del tema ${theme === 'dark' ? 'oscuro' : 'claro'}, leídos en vivo. El contraste se mide sobre un módulo: texto ≥ 4,5:1 y elementos gráficos ≥ 3:1 (WCAG 2.2 AA).`}
      >
        <div className="dsp-colors">
          {COLOR_GROUPS.map(group => (
            <div key={group.title} className="dsp-colors__group">
              <span className="ds-eyebrow">{group.title}</span>
              <ul>
                {group.tokens.map(token => {
                  const v = values[token.name];
                  return (
                    <li key={token.name} className="dsp-swatch">
                      <span className="dsp-swatch__chip" style={{background: `var(${token.name})`}} aria-hidden="true" />
                      <span className="dsp-swatch__meta">
                        <code>{token.name}</code>
                        <span>{token.use}</span>
                      </span>
                      <span className="dsp-swatch__value">
                        <code>{v?.hex}</code>
                        <ContrastBadge token={token} value={v} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen
        id="tipografia"
        title="Tipografía"
        description="Montserrat Variable. Cifras protagonistas en peso ligero; etiquetas en mayúsculas espaciadas."
      >
        <ul className="dsp-type">
          {TYPE_SCALE.map(t => (
            <li key={t.name}>
              <span className="dsp-type__meta">
                <code>{t.name}</code>
                <span>
                  {remToPx(values[t.name]?.raw ?? '')} · {t.weight}
                </span>
              </span>
              <span
                className={`dsp-type__sample ${t.eyebrow ? 'ds-eyebrow' : ''}`}
                style={{fontSize: `var(${t.name})`, fontWeight: t.weight}}
              >
                {t.sample}
              </span>
            </li>
          ))}
        </ul>
      </Specimen>

      <div className="dsp-grid-2">
        <Specimen id="espaciado" title="Espaciado" description="Retícula de 8 px; 4 px solo como medio paso.">
          <ul className="dsp-spacing">
            {SPACING.map(name => (
              <li key={name}>
                <code>{name}</code>
                <span className="dsp-spacing__bar" style={{width: `var(${name})`}} aria-hidden="true" />
                <span className="ds-tabular">{values[name]?.raw}</span>
              </li>
            ))}
          </ul>
        </Specimen>

        <Specimen id="radios" title="Radios y controles" description="Radios 8/16/24/32 y alturas de control 32/40/48.">
          <div className="dsp-radii">
            {RADII.map(name => (
              <div key={name} className="dsp-radii__item">
                <span className="dsp-radii__box" style={{borderRadius: `var(${name})`}} aria-hidden="true" />
                <code>{name.replace('--radius-', '')}</code>
              </div>
            ))}
          </div>
          <div className="dsp-controls-scale">
            {CONTROLS.map(name => (
              <div key={name} className="dsp-controls-scale__item">
                <span style={{height: `var(${name})`}} aria-hidden="true" />
                <code>
                  {name.replace('--control-', '')} · {values[name]?.raw}
                </code>
              </div>
            ))}
          </div>
        </Specimen>
      </div>

      <Specimen
        id="iconos"
        title="Iconografía"
        description={`Coolicons · Line Regular (MIT). Set acotado de ${ICONS.length} iconos registrados en un único módulo.`}
      >
        <ul className="dsp-icons">
          {ICONS.map(({name, Icon}) => (
            <li key={name} title={name}>
              <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </Specimen>
    </section>
  );
}
