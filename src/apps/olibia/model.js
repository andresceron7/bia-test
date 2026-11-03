import {channelFor} from './filters';

// Las filas originales son arrays: [empresa, etapa, valor, responsable, próximo contacto]
export const STAGES = ['Contacto', 'Calificación', 'Propuesta', 'Negociación'];
export const CHANNELS = ['Outbound', 'Referidos', 'Inbound'];
export const OWNERS = ['Ana López', 'Carlos Ruiz', 'Laura Díaz', 'Mateo Gil'];
export const MONTHLY_GOAL = 10;

// month: índice 0–11 usado por el selector de periodo
export const PERIOD_YEAR = 2026;
export const PERIODS = [
  {value: 'sep', month: 8, long: 'Septiembre 2026', previous: 'agosto'},
  {value: 'oct', month: 9, long: 'Octubre 2026', previous: 'septiembre'},
];

export const VALUE_OPTIONS = [
  {value: '30', label: 'Desde $30 M'},
  {value: '50', label: 'Desde $50 M'},
];

export const EMPTY_FILTERS = {query: '', stage: '', owner: '', channel: '', minimum: ''};

export const toOpportunity = (row, allRows) => ({
  company: row[0],
  stage: row[1],
  value: row[2],
  owner: row[3],
  nextContact: row[4],
  channel: channelFor(row, allRows),
  row,
});

export const sumValue = list => list.reduce((sum, o) => sum + o.value, 0);

// "28 oct" → 28, para ordenar por fecha de contacto dentro del mismo mes
export const contactDay = o => parseInt(o.nextContact, 10);

export function toCSV(opportunities) {
  const header = ['Empresa', 'Etapa', 'Valor mensual COP millones', 'Responsable', 'Proximo contacto'];
  return '﻿' + [header, ...opportunities.map(o => o.row)].map(r => r.join(';')).join('\r\n');
}
