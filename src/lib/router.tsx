import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Route = { path: string; params: Record<string, string> };

const RouterContext = createContext<{
  route: Route;
  navigate: (path: string) => void;
}>({ route: { path: '/', params: {} }, navigate: () => {} });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#/, '') || '/';
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return { path: '/', params: {} };
  if (parts.length === 1) return { path: `/${parts[0]}`, params: {} };
  if (parts.length === 2) return { path: `/${parts[0]}/:id`, params: { id: parts[1] } };
  return { path: '/', params: {} };
}

export function useRouter() {
  return useContext(RouterContext);
}
