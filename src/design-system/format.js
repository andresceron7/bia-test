const number = new Intl.NumberFormat('es-CO');

// Valores en millones de pesos colombianos
export const formatMillions = value => `$${number.format(value)} M`;
export const formatNumber = value => number.format(value);
export const formatPercent = value => `${number.format(Math.round(value))}%`;

export const initials = name =>
  name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
