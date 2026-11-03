# Prueba Design Engineer · Bia / Olibia

Dos experiencias en React construidas para la prueba de Design Engineer.

| Experiencia | Ruta | Estado |
|---|---|---|
| 01 · Uplift radical de Olibia | `#/olibia` | Lista |
| 02 · Experiencia de energía para Bia | `#/bia` | Lista |
| Módulo extra · Design System | `#/design-system` | Lista |

**Demo:** https://andresceron7.github.io/bia-test/

**Cambiar entre tareas:** desde el módulo de perfil. En Olibia está al pie del menú lateral y en Bia, arriba a la derecha. El menú ofrece dos perfiles: **Perfil comercial** (Tarea 1) y **Perfil cliente** (Tarea 2), cada uno con un chip que indica su tarea.

---

## Cómo ejecutarlo

Requiere Node.js 20.19+ o 22.12+.

```sh
npm ci
npm run dev       # desarrollo en http://localhost:5173 (#/olibia, #/bia, #/design-system)
npm run build     # versión de producción en dist/
npm run preview   # sirve la versión de producción
```

No necesita backend: los datos son ficticios y los estados (carga, seguimientos, filtros, exportación CSV) se simulan en el navegador.

## Estructura

```
src/
  main.jsx              Rutas por hash (funciona en cualquier hosting estático)
  design-system/        Tokens, componentes y gráficas reutilizables
  apps/olibia/          Tarea 1: dashboard comercial
    data.js, filters.js Datos y filtros originales, sin cambios
  apps/bia/             Tarea 2: experiencia de la factura de energía
  apps/design-system/   Módulo extra: documentación viva del sistema de diseño
```

---

## 01 · Uplift radical de Olibia

### Dirección visual y decisiones

<!-- 150–250 palabras -->
Tomé como referencia la interfaz de Tesla: futurista pero obvia de usar. El dashboard vive en modo oscuro, sobre un único lienzo con un brillo turquesa muy leve, y la información flota en módulos sin bordes. Montserrat aporta un tono geométrico; los números protagonistas van en peso ligero y grande, y las etiquetas en mayúsculas espaciadas. El único acento es el turquesa del rayo de Bia, llevado un 10% hacia neón, y se reserva para lo que importa: el mes actual, la meta y la selección.

El cambio estructural más importante fue separar el dashboard en dos zonas con su alcance explícito. «Resultados del periodo» muestra los cierres del equipo completo y avisa que no cambia con filtros; «Pipeline abierto» agrupa todo lo que sí responde a ellos. En el original esa diferencia solo se explicaba en una nota.

La exploración ocurre donde está el dato: las gráficas de etapa y canal funcionan como filtros, la tabla se ordena y cada oportunidad abre un panel lateral con su progreso en el embudo y la acción de registrar el seguimiento, que se confirma y se puede deshacer. El periodo se elige en un calendario mensual que solo habilita los meses con datos. El menú lateral es de vidrio, se colapsa con una pestaña en su borde y, en tablet, flota sobre el contenido.

Expresividad en las cifras clave; calma en todo lo demás.

### Qué probar

1. **Cambiar de periodo:** botón «Periodo · Oct» → calendario → septiembre. Aparece un estado de carga y todo el dashboard se actualiza.
2. **Filtrar desde las gráficas:** toca una etapa o un canal en «Pipeline abierto»; vuelve a tocarlo para quitar el filtro. Los cierres, arriba, no cambian.
3. **Explorar y actuar:** abre una oportunidad de la tabla → «Marcar seguimiento realizado» → «Deshacer». La tabla refleja el estado.
4. **Estados vacíos:** busca una empresa que no exista, o filtra «Negociación» en septiembre.
5. **Menú:** colapsa y expande con la pestaña del borde; abre «Configuración» para cambiar entre modo oscuro y claro.
6. **Teclado:** `Tab` desde el inicio («Saltar al contenido»), flechas dentro del calendario y `Escape` para cerrar el panel, el menú o los tooltips.
7. **Responsive:** escritorio, tablet (menú flotante y tabla en tarjetas) y móvil (menú deslizable y hojas inferiores).
8. **Exportar CSV:** respeta los filtros activos.
9. **Design System:** botón verde «Ver Design System (módulo extra)» en el pie del dashboard.

### Criterios de calidad aplicados

- **Retícula de 8 px** en espacios, tamaños de control (32/40/48), íconos (16/20/24) y radios (8/16/24/32).
- **Accesibilidad WCAG 2.2 AA:** texto ≥ 4,5:1; datos de gráficas y contornos de campos ≥ 3:1; objetivos interactivos ≥ 24 × 24 px; foco visible, gestión de foco en capas y panel, tooltips que se pueden recorrer y cerrar con `Escape`; las acciones no dependen del hover, y se respeta la preferencia de movimiento reducido. En modo claro las gráficas usan un turquesa más profundo para mantener el contraste.
- **Sin desbordes** de 320 a 1440 px de ancho.

### Decisiones sobre los datos

- Se conservaron los datos, los filtros y su significado originales (`data.js` y `filters.js` sin cambios).
- El **canal** no viene en los datos: el código base lo deriva de la posición de cada fila. Se mantuvo esa lógica para no alterar el significado, y se muestra en el detalle de cada oportunidad.
- Los seguimientos se guardan solo durante la sesión, como en el material original.

---

## Módulo extra · Design System

Desde el pie del dashboard, el botón **«Ver Design System (módulo extra)»** abre una documentación viva del sistema con el que está construida la Tarea 1. Se incluye solo para la evaluación; en producción viviría como herramienta interna del equipo.

- **Fundamentos:** paleta de color con valores y contraste WCAG medidos en vivo para el tema activo, escala tipográfica, espaciado de 8 px, radios, alturas de control e iconografía.
- **Componentes interactivos:** Button con un panel de variantes (jerarquía, tamaño, icono, solo icono, deshabilitado), Badge, campos y selectores, Switch, Tooltip, Stat y Card, capas (panel lateral, popover, avisos) y estados (carga, vacío, menú, avatar).
- **Gráficas:** ColumnChart con meta ajustable y datos aleatorios, ProgressRing con control de progreso, CompareBars, WaterfallChart, StackedBars, ProfileChart, BarList y ShareBar filtrables.

Todo lo que se muestra son los componentes reales del producto, no capturas: cualquier cambio en el sistema se refleja en el dashboard y en esta página a la vez.

---

## 02 · Experiencia de energía para Bia

### Por qué esta solución

<!-- 150–250 palabras -->
La dueña de tres cafeterías no necesita un tablero: necesita una respuesta rápida y poco texto. Por eso la página empieza por un solo módulo de comparación: octubre frente a septiembre, con la conclusión en una frase a un lado (subió $1,2 M porque se consumieron 1.500 kWh más, con la misma tarifa) y las cifras al otro. Un selector de mes deja la puerta abierta a comparar con cualquier mes del año; por el alcance del ejercicio solo septiembre tiene datos.

Debajo, los detalles de consumo: una cascada convierte la diferencia en cuatro aportes que suman exacto, incluido uno que nadie busca (octubre tuvo un día más), o una vista completa con el consumo total por sede. Todo se puede ver en dinero o en kWh.

Las sedes muestran dónde está el aumento y su consumo frente al mes anterior. Al elegir una, el gráfico día por día hace evidente el salto del 12 de octubre en Chapinero, y una alerta amarilla resume el hallazgo. El detalle de las posibles causas vive en un popup: lo medido se presenta como hecho y la causa como hipótesis, con su pista y su forma de confirmarla.

Cierro con tres pasos en orden de esfuerzo: un checklist para la encargada, una alerta nocturna y una visita técnica. El turquesa queda para lo accionable y el ámbar para el aumento.

### Qué probar

1. **Comparación:** la primera tarjeta debería bastar para entender qué pasó. Abre «Comparar con» para ver el calendario de meses.
2. **Detalles de consumo:** cambia entre **Dinero** y **kWh** y entre **Ver diferencial** (cascada) y **Ver completo** (consumo total por sede). El filtro «Mes» muestra el calendario con octubre activo. El panel de Chapinero fuera de horario es fijo.
3. **Sedes:** elige cada sede; compara su barra de septiembre y octubre y el gráfico día por día.
4. **Alerta de Chapinero:** «Ver detalles» abre el popup con las posibles causas; «Ver qué hacer» lleva a los pasos.
5. **Pasos:** checklist (marca puntos y envíalo), alerta nocturna (activar/desactivar) y visita técnica (elegir horario, confirmar, cambiar). Cada acción muestra carga, confirmación y progreso.
6. **Celular:** la cascada pasa a filas horizontales, todo se apila y el popup se abre desde abajo.

### Datos del escenario

Se respetan los datos del enunciado (factura $4,8 M → $6 M, consumo 6.000 → 7.500 kWh, tarifa $800/kWh, 1.200 de 1.500 kWh adicionales en una sede, consumo fuera de horario sin causa confirmada) y se añadieron datos coherentes que cuadran exacto:

| Aporte al aumento | kWh | Pesos |
|---|---|---|
| Chapinero fuera de horario (20:00–6:00, desde el 12 oct) | 900 | $720 mil |
| Chapinero en horario (desde el 12 oct) | 220 | $176 mil |
| Octubre tuvo 31 días (septiembre, 30) | 200 | $160 mil |
| Usaquén y Cedritos | 180 | $144 mil |
| **Total** | **1.500** | **$1,2 M** |

El ahorro de hasta $1,08 M al mes (4,5 kW × 10 h × 30 días × $800) se presenta siempre como **estimado**, condicionado a confirmar la causa. Las acciones (enviar checklist, activar alerta, agendar visita) son simuladas.

---

## Criterio

La reflexión sobre prioridades, expresividad, alcance y próximos pasos está en [`criterio.md`](criterio.md).

## Herramientas y AI

- **React 19 + Vite**, CSS propio con tokens (sin frameworks de UI).
- **Coolicons** (MIT, Kryston Schwarze) para la iconografía y **Montserrat** (Fontsource) para la tipografía.
- **Claude Code** como asistente de implementación: código de componentes y gráficas, auditorías de contraste, tamaño de objetivos y desbordes, y verificación en el navegador.

## Qué refiné personalmente

### Tarea 1 · Olibia

- **Dirección de arte:** partí de un estilo basado en Bia y sus herramientas, mezclado con un estilo en tendencia inspirado en Tesla: minimalista, en modo oscuro y con prioridad para la información gráfica. Incorporé un estilo LiquidGlass sobre un único fondo, con elementos «flotantes» con contraste de vidrio. Usé una tipografía sans-serif, Montserrat, y los íconos de Coolicons.
- **Color de acento:** a partir del rayo de Bia, con un 10% más de neón. En algunos elementos ajusté el tono y retiré el brillo neón, porque generaba marcos visibles que se veían como un error.
- **Menú lateral:** diseñé la navegación y su comportamiento colapsable, con secciones que pueden ser importantes más adelante y una configuración del portal. Desde ahí se cambia entre modo claro y oscuro: al ser una herramienta de uso diario, es importante que tenga ambos modos.
- **Cambio de periodo:** dejé visibles todos los meses del año, aunque solo septiembre y octubre están activos por el alcance del ejercicio; imagino una plataforma para todo el año. Además, agregué la comparación con el mes anterior para que el usuario la vea de forma visual.
- **Calidad:** me parece importante la adaptabilidad responsive, la retícula de 8 px y, sobre todo, el cumplimiento de WCAG.
- **Animación:** usé animación en las gráficas al cambiar un filtro o al llegar al dashboard, para atraer la atención del usuario.
### Tarea 2 · Bia

- **Navegación por perfil:** decidí que el cambio entre tareas viva en el perfil del usuario, con dos perfiles (comercial y cliente) y un chip translúcido que indica a qué tarea pertenece cada uno, en lugar de un enlace en el pie de página.
- **Menos texto, más claridad:** reduje el texto explicativo para que la experiencia fuera fácil de usar. La comparación entre meses quedó como módulo principal, con la explicación en solo un tercio de la tarjeta.
- **Comparación con cualquier mes:** el selector muestra todo el año para comparar con octubre; solo septiembre está activo por el alcance del ejercicio.
- **Detalles de consumo con filtros:** se pueden ver en dinero o en kWh, y entre el diferencial y el consumo completo. El texto se adapta al filtro y el hallazgo principal (Chapinero fuera de horario) se mantiene fijo.
- **Sedes y consumo diario:** a cada sede le agregué la comparación con el mes anterior, y dejé solo la gráfica por día con los 31 días marcados. La anomalía aparece como una alerta amarilla que abre un popup con las hipótesis.
- **Orden visual:** quité la numeración de las secciones para que la página se leyera como una sola historia.

## Tiempo dedicado

- **Tarea 1 (Olibia):** 2 h 47 min.
- **Tarea 2 (Bia):** 1 h 12 min.
- **Total:** 3 h 59 min.
