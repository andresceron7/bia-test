import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './design-system';
import OlibiaApp from './apps/olibia/OlibiaApp';
import DesignSystemPage from './apps/design-system/DesignSystemPage';
import BiaApp from './apps/bia/BiaApp';

// Rutas por hash para que la demo funcione en cualquier hosting estático.
const ROUTES = {
  '/olibia': OlibiaApp,
  '/bia': BiaApp,
  '/design-system': DesignSystemPage,
};
const DEFAULT_ROUTE = '/olibia';

const currentPath = () => window.location.hash.replace(/^#/, '') || DEFAULT_ROUTE;

function Router() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  // Cada página empieza arriba al navegar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
  const Page = ROUTES[path] ?? ROUTES[DEFAULT_ROUTE];
  return <Page />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
