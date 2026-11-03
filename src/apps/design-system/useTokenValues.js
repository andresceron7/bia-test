import {useLayoutEffect, useState} from 'react';

const parseRgb = value => {
  const [r, g, b, a = 1] = value.match(/[\d.]+/g).map(Number);
  return {r, g, b, a};
};
const toHex = ({r, g, b}) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const blend = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
const luminance = ({r, g, b}) => {
  const ch = v => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};
export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * Resuelve tokens CSS a valores reales del tema activo.
 * Los colores se resuelven con un elemento sonda para obtener rgb() aunque el token use var().
 */
export function useTokenValues(names, theme) {
  const [values, setValues] = useState({});
  useLayoutEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const probe = document.createElement('span');
    document.body.append(probe);
    const resolveColor = name => {
      probe.style.color = `var(${name})`;
      return parseRgb(getComputedStyle(probe).color);
    };
    const bg = resolveColor('--bg');
    // Fondo de referencia para contraste: un módulo (surface) sobre el lienzo
    const card = blend(resolveColor('--surface'), bg);
    const next = {};
    for (const name of names) {
      const raw = root.getPropertyValue(name).trim();
      const isColor = /^(#|rgb|var\(--)/.test(raw);
      if (isColor) {
        const rgb = resolveColor(name);
        const solid = blend(rgb, card);
        next[name] = {raw, hex: rgb.a < 1 ? `${toHex(rgb)} · ${Math.round(rgb.a * 100)}%` : toHex(rgb), rgb, ratio: contrast(solid, card)};
      } else {
        next[name] = {raw};
      }
    }
    probe.remove();
    setValues(next);
  }, [names, theme]);
  return values;
}
