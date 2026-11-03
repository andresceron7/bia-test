// Escenario ficticio de la prueba, ampliado con datos coherentes.
// Todo cuadra: 6.000 → 7.500 kWh, $4,8 M → $6,0 M, tarifa constante de $800/kWh.

export const TARIFF = 800; // COP por kWh, igual en ambos meses
export const CLOSED = {from: 20, to: 6}; // Horario habitual: abren 6:00, cierran 20:00
export const ANOMALY_START = 12; // Día de octubre en que aparece el consumo nocturno

export const BILL = {
  previous: {label: 'Septiembre', days: 30, kwh: 6000},
  current: {label: 'Octubre', days: 31, kwh: 7500},
};

export const SITES = [
  {id: 'chapinero', name: 'Chapinero', manager: 'Juliana Rojas', previous: 2400, current: 3600},
  {id: 'usaquen', name: 'Usaquén', manager: 'Sara Méndez', previous: 2000, current: 2200},
  {id: 'cedritos', name: 'Cedritos', manager: 'Diego Rincón', previous: 1600, current: 1700},
];

// Descomposición de los 1.500 kWh adicionales (suma exacta)
export const DRIVERS = [
  {
    id: 'night',
    label: 'Chapinero fuera de horario',
    kwh: 900,
    kind: 'fact',
    emphasis: true,
    site: 'chapinero',
    summary: {
      kwh: 'Desde el 12 de octubre, Chapinero gasta 900 kWh extra entre las 20:00 y las 6:00, con la sede cerrada.',
      money: 'Desde el 12 de octubre, el consumo nocturno de Chapinero, con la sede cerrada, sumó $720 mil.',
    },
    pending: true,
  },
  {
    id: 'day',
    label: 'Chapinero en horario',
    kwh: 220,
    kind: 'fact',
    site: 'chapinero',
    summary: {
      kwh: 'En horario de atención, Chapinero gasta unos 11 kWh más por día desde el 12 de octubre.',
      money: 'En horario de atención, Chapinero sumó $176 mil desde el 12 de octubre.',
    },
  },
  {
    id: 'calendar',
    label: 'Octubre tuvo un día más',
    kwh: 200,
    kind: 'fact',
    summary: {
      kwh: 'Octubre tiene un día más que septiembre: un día de tus tres sedes son 200 kWh.',
      money: 'Octubre tiene un día más que septiembre: ese día costó $160 mil. No requiere acción.',
    },
  },
  {
    id: 'others',
    label: 'Usaquén y Cedritos',
    kwh: 180,
    kind: 'fact',
    site: 'usaquen',
    summary: {
      kwh: 'Usaquén (+133 kWh) y Cedritos (+47 kWh) variaron dentro de lo normal.',
      money: 'Usaquén y Cedritos sumaron $144 mil, dentro de su variación normal.',
    },
  },
];

export const HYPOTHESES = [
  {
    id: 'heat',
    title: 'Un equipo de calor quedó encendido',
    examples: 'Horno, plancha, calentador de agua o máquina de espresso.',
    likelihood: 'Más probable',
    clue: 'El consumo extra es plano y constante toda la noche (~4,5 kW), como un equipo que nunca se apaga.',
    verify: 'Revisar los equipos al cierre de hoy. Si mañana el consumo nocturno baja, queda confirmado.',
  },
  {
    id: 'cold',
    title: 'La refrigeración trabaja de más',
    examples: 'Puerta del cuarto frío mal cerrada o empaque dañado.',
    likelihood: 'Posible',
    clue: 'La refrigeración suele subir y bajar por ciclos; aquí la curva es plana, por eso es menos probable.',
    verify: 'Revisar sellos, puertas y la temperatura de neveras y cuarto frío.',
  },
  {
    id: 'change',
    title: 'Algo cambió el 12 de octubre',
    examples: 'Un equipo nuevo, limpieza nocturna o un cambio de turno.',
    likelihood: 'Posible',
    clue: 'El aumento aparece de un día para otro, no de forma gradual.',
    verify: 'Preguntar a Juliana, encargada de Chapinero, qué cambió esa semana.',
  },
];

// Perfil horario promedio de un día (kW). Antes: septiembre. Después: desde el 12 de octubre.
const CHAPINERO_BEFORE = [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 4, 6, 6.5, 6, 5, 5, 4.5, 5, 4, 4, 4, 4, 3.5, 3, 2, 1.5, 1.5, 1.5];
const isClosed = h => h >= CLOSED.from || h < CLOSED.to;
const CHAPINERO_AFTER = CHAPINERO_BEFORE.map((v, h) => +(v + (isClosed(h) ? 4.5 : 11 / 14)).toFixed(2));
const scaleProfile = (profile, factor, bump = 0) => profile.map((v, h) => +(v * factor + (isClosed(h) ? 0 : bump)).toFixed(2));

export const PROFILES = {
  chapinero: {before: CHAPINERO_BEFORE, after: CHAPINERO_AFTER},
  usaquen: {before: scaleProfile(CHAPINERO_BEFORE, 2000 / 2400), after: scaleProfile(CHAPINERO_BEFORE, 2000 / 2400, 0.3)},
  cedritos: {before: scaleProfile(CHAPINERO_BEFORE, 1600 / 2400), after: scaleProfile(CHAPINERO_BEFORE, 1600 / 2400, 0.1)},
};

// Consumo diario de octubre por sede, con variación determinista y total exacto
function dailySeries(total, base, {jumpFrom, jumpTo} = {}) {
  const days = Array.from({length: 31}, (_, i) => {
    const day = i + 1;
    const weekend = [3, 4].includes(day % 7) ? 1.06 : 1; // sábados y domingos un poco más
    const level = jumpFrom && day >= jumpFrom ? jumpTo : base;
    const wobble = 1 + Math.sin(day * 2.3) * 0.03;
    return level * weekend * wobble;
  });
  const sum = days.reduce((a, b) => a + b, 0);
  const rounded = days.map(v => Math.round((v * total) / sum));
  rounded[30] += total - rounded.reduce((a, b) => a + b, 0);
  return rounded.map((kwh, i) => ({day: i + 1, kwh}));
}

export const DAILY = {
  chapinero: dailySeries(3600, 80, {jumpFrom: ANOMALY_START, jumpTo: 136}),
  usaquen: dailySeries(2200, 71),
  cedritos: dailySeries(1700, 55),
};

// Promedio diario de septiembre, como referencia en la gráfica diaria
export const SEPTEMBER_DAILY = {chapinero: 80, usaquen: 67, cedritos: 53};

// Si se elimina el consumo nocturno: 4,5 kW × 10 h × 30 días × tarifa
export const NIGHT_SAVINGS = 4.5 * 10 * 30 * TARIFF;
