import { Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '../lib/router';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'Colleges', path: '/colleges' },
  { label: 'Career Paths', path: '/careers' },
  { label: 'Find My Path', path: '/quiz' },
];

export function Navbar() {
  const { route, navigate } = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    return route.path.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => handleNav('/')} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold text-slate-900">PathFinder</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
