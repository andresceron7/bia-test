/**
 * Ficha de documentación: título, descripción, escenario de vista previa y controles de variantes.
 */
export function Specimen({id, title, description, controls, children, stageClassName = ''}) {
  return (
    <article id={id} className="dsp-specimen" aria-labelledby={`${id}-title`} tabIndex={-1}>
      <header className="dsp-specimen__head">
        <h3 id={`${id}-title`}>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      {controls && <div className="dsp-specimen__controls">{controls}</div>}
      <div className={`dsp-specimen__stage ${stageClassName}`}>{children}</div>
    </article>
  );
}

/** Grupo de control etiquetado para el panel de variantes. */
export function Control({label, children}) {
  return (
    <div className="dsp-control">
      <span className="dsp-control__label" aria-hidden="true">
        {label}
      </span>
      {children}
    </div>
  );
}
