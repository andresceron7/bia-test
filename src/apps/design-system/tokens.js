// Catálogo de tokens que muestra la página. Los valores se leen en vivo del CSS,
// así la documentación nunca se desincroniza del producto.
export const COLOR_GROUPS = [
  {
    title: 'Acento',
    tokens: [
      {name: '--accent', use: 'Botones primarios y selección'},
      {name: '--accent-strong', use: 'Hover del acento'},
      {name: '--accent-text', use: 'Texto y bordes activos', text: true},
      {name: '--accent-graphic', use: 'Datos destacados en gráficas', graphic: true},
      {name: '--accent-soft', use: 'Fondos seleccionados'},
    ],
  },
  {
    title: 'Superficies',
    tokens: [
      {name: '--bg', use: 'Lienzo único'},
      {name: '--surface', use: 'Módulos flotantes'},
      {name: '--surface-raised', use: 'Capas: panel, popover, tooltip'},
      {name: '--surface-sunken', use: 'Rellenos de campos y filas'},
    ],
  },
  {
    title: 'Texto',
    tokens: [
      {name: '--text', use: 'Contenido principal', text: true},
      {name: '--text-muted', use: 'Contenido secundario', text: true},
      {name: '--text-subtle', use: 'Etiquetas y ejes', text: true},
    ],
  },
  {
    title: 'Datos y campos',
    tokens: [
      {name: '--data-muted', use: 'Series de referencia', graphic: true},
      {name: '--data-alt', use: 'Serie secundaria', graphic: true},
      {name: '--data-track', use: 'Pistas decorativas'},
      {name: '--border-field', use: 'Contorno de campos', graphic: true},
    ],
  },
  {
    title: 'Estados',
    tokens: [
      {name: '--success', use: 'Tendencia positiva', text: true},
      {name: '--warning', use: 'Tendencia negativa', text: true},
      {name: '--danger', use: 'Acciones destructivas', text: true},
    ],
  },
];

export const TYPE_SCALE = [
  {name: '--text-display', sample: '$338 M', weight: 300},
  {name: '--text-2xl', sample: 'Dashboard comercial', weight: 300},
  {name: '--text-xl', sample: 'Alimentos del Norte', weight: 500},
  {name: '--text-lg', sample: 'Resultados del periodo', weight: 500},
  {name: '--text-md', sample: 'Oportunidades por etapa', weight: 600},
  {name: '--text-sm', sample: 'Texto de interfaz y tablas', weight: 400},
  {name: '--text-xs', sample: 'ETIQUETA · EYEBROW', weight: 600, eyebrow: true},
];

export const SPACING = ['--space-1', '--space-2', '--space-4', '--space-6', '--space-8', '--space-10', '--space-12'];
export const RADII = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-pill'];
export const CONTROLS = ['--control-sm', '--control-md', '--control-lg'];
