// Perfiles de la demo: cada uno abre la experiencia de una tarea de la prueba.
export const PROFILES = [
  {
    id: 'comercial',
    label: 'Perfil comercial',
    name: 'Equipo comercial',
    detail: 'Olibia',
    task: 'Tarea 1',
    href: '#/olibia',
  },
  {
    id: 'cliente',
    label: 'Perfil cliente',
    name: 'Marcela Vargas',
    detail: 'Bia · Café Aurora',
    task: 'Tarea 2',
    href: '#/bia',
  },
];

export const goToProfile = profile => {
  window.location.hash = profile.href.slice(1);
};
