import {forwardRef} from 'react';
import {Tooltip} from './Tooltip';

/**
 * Botón base.
 * variant: primary | secondary | ghost · size: sm | md
 * Con `iconOnly`, `label` se usa como nombre accesible y como tooltip.
 */
export const Button = forwardRef(function Button(
  {
    variant = 'secondary',
    size = 'md',
    icon: Icon,
    iconOnly = false,
    label,
    tooltipSide = 'top',
    loading = false,
    children,
    className = '',
    disabled,
    ...rest
  },
  ref,
) {
  const classes = ['ds-button', `ds-button--${variant}`, `ds-button--${size}`, iconOnly && 'ds-button--icon', className]
    .filter(Boolean)
    .join(' ');
  const button = (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-label={iconOnly ? label : undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="ds-button__spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 16 : 20} strokeWidth={1.6} />
      )}
      {!iconOnly && <span>{children ?? label}</span>}
    </button>
  );
  return iconOnly ? (
    <Tooltip content={label} side={tooltipSide}>
      {button}
    </Tooltip>
  ) : (
    button
  );
});
