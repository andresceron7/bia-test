import {TARIFF} from './data';

const decimal = new Intl.NumberFormat('es-CO', {maximumFractionDigits: 2});
const integer = new Intl.NumberFormat('es-CO');

const NBSP = '\u00a0'; // el número y su unidad nunca se separan en dos líneas

/** Pesos en lenguaje cotidiano: "$6 M", "$1,2 M", "$720 mil". */
export function formatCOP(pesos) {
  const abs = Math.abs(pesos);
  if (abs >= 1e6) return `$${decimal.format(abs / 1e6)}${NBSP}M`;
  return `$${integer.format(Math.round(abs / 1000))}${NBSP}mil`;
}

export const formatKwh = kwh => `${integer.format(Math.round(kwh))}${NBSP}kWh`;
export const formatKw = kw => decimal.format(kw);
export const toPesos = kwh => kwh * TARIFF;
export const formatPct = value => `${integer.format(Math.round(value))}%`;
