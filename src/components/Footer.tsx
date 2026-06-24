import { Compass } from 'lucide-react';
import { useRouter } from '../lib/router';

export function Footer() {
  const { navigate } = useRouter();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold text-slate-900">PathFinder</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              Helping 12th and undergraduate students discover the right courses, colleges, and
              career paths with clarity and confidence.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><button onClick={() => navigate('/courses')} className="hover:text-primary-600">Courses</button></li>
              <li><button onClick={() => navigate('/colleges')} className="hover:text-primary-600">Colleges</button></li>
              <li><button onClick={() => navigate('/careers')} className="hover:text-primary-600">Career Paths</button></li>
              <li><button onClick={() => navigate('/quiz')} className="hover:text-primary-600">Career Quiz</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">About</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>How it works</li>
              <li>For Students</li>
              <li>For Parents</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} PathFinder. Built for students, by guidance.
        </div>
      </div>
    </footer>
  );
}
