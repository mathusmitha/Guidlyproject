import { useEffect, useState } from 'react';
import { Search, TrendingUp, ArrowRight, Award, Briefcase } from 'lucide-react';
import { supabase, type CareerPath } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { formatSalary } from '../lib/utils';
import { Loading, EmptyState } from '../components/States';

export function CareersPage() {
  const { navigate } = useRouter();
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [outlookFilter, setOutlookFilter] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('career_paths').select('*').order('title');
      setCareers(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = careers.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (outlookFilter && c.growth_outlook !== outlookFilter) return false;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Career Paths</h1>
        <p className="mt-2 text-slate-500">Discover where your education can take you</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select value={outlookFilter} onChange={(e) => setOutlookFilter(e.target.value)} className="input w-auto min-w-[140px]">
          <option value="">All Outlooks</option>
          <option value="High">High Growth</option>
          <option value="Medium">Medium Growth</option>
          <option value="Low">Low Growth</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Briefcase className="h-12 w-12" />} title="No careers found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((career) => (
            <button
              key={career.id}
              onClick={() => navigate(`/careers/${career.slug}`)}
              className="card group p-5 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-600 group-hover:text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className={`badge ${
                  career.growth_outlook === 'High'
                    ? 'bg-accent-50 text-accent-700'
                    : career.growth_outlook === 'Medium'
                    ? 'bg-warning-50 text-warning-600'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {career.growth_outlook} growth
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-slate-900 group-hover:text-primary-700">
                {career.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{career.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="badge bg-primary-50 text-primary-700">
                  <Award className="h-3 w-3" /> {formatSalary(career.avg_salary)}
                </span>
                {career.industries && career.industries.length > 0 && (
                  <span className="badge bg-slate-100 text-slate-500">{career.industries[0]}</span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
