# Criterio

Reflexión sobre cómo tomé las decisiones en las dos experiencias. Sirve de guía para leer el resultado: qué prioricé, dónde puse expresividad y dónde calma, qué dejé fuera a propósito y qué haría con más tiempo.

## Qué prioricé

**Entender antes que explorar.** En ambas tareas, lo primero en pantalla responde la pregunta principal del usuario. En Olibia: cómo va el equipo frente a la meta. En Bia: por qué subió la factura. La exploración (filtros, detalle, popups) viene después y nunca es obligatoria para entender.

**Que los datos digan solo lo que pueden decir.** En Olibia separé visualmente los cierres del equipo, que no cambian con los filtros, del pipeline, que sí cambia; en el material original esa diferencia solo se explicaba en una nota. En Bia separé lo medido de lo supuesto: el consumo nocturno es un hecho, su causa es una hipótesis y el ahorro es un estimado, y cada cosa lleva su etiqueta. Cuando corté el eje de la cascada para que los aportes pequeños se leyeran, lo marqué de forma explícita.

**Accesibilidad y consistencia como base, no como extra.** Un solo sistema de componentes para todo, retícula de 8 px, contraste WCAG AA medido en ambos temas, objetivos táctiles de al menos 24 px, navegación completa con teclado y respeto por el movimiento reducido.

## Dónde puse expresividad y dónde calma

- **Expresividad:** las cifras protagonistas (números grandes en peso ligero), el único color de acento, el turquesa del rayo de Bia, y el vidrio del menú lateral. El acento se reserva para lo que importa: el mes actual, la meta, el hallazgo principal y las acciones.
- **Calma:** todo lo demás. Fondos sin bordes, grises para las series de referencia, poco texto y animaciones breves que acompañan los cambios de datos sin distraer.
- **Corrección propia:** probé un brillo neón en el acento y lo retiré, porque generaba marcos visibles que se veían como un error. También fui recortando texto explicativo a medida que la interfaz se volvía más clara por sí sola.

## Lo que dejé fuera a propósito

- **Datos que no existen.** Los filtros de mes muestran el año completo, pero solo habilitan los meses con datos en vez de inventarlos.
- **Secciones sin contenido real.** Clientes, Equipo, Reportes y parte de la configuración aparecen como «Pronto» o atenuadas: muestran la estructura prevista sin fingir funcionalidad.
- **Backend e integraciones.** Exportar, enviar el checklist, activar la alerta o agendar la visita son acciones simuladas con estados completos de carga y confirmación.

## Qué haría con más tiempo

- Validar la experiencia de Bia con dueños de negocios reales: ¿entienden la cascada sin ayuda? ¿«kWh» les dice algo o prefieren solo pesos?
- Habilitar la comparación con cualquier mes y un histórico anual, con estados vacíos para meses sin datos.
- Cerrar el ciclo de la alerta nocturna: avisar cuando el consumo baja y mostrar el ahorro confirmado.
- Pruebas automatizadas de accesibilidad y regresión visual en cada cambio, y llevar los componentes a Figma como sistema de diseño compartido.

## Uso de la AI

Usé Claude Code como asistente de implementación y auditoría: escribir componentes, medir contraste y desbordes, y probar en el navegador. Las decisiones de dirección, prioridad y alcance fueron mías, y las fui corrigiendo en cada iteración. El detalle está en el README, en «Qué refiné personalmente».
