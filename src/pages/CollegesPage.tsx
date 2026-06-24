import { useEffect, useState } from 'react';
import { Search, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { supabase, type College } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { StarRating } from '../components/StarRating';
import { Loading, EmptyState } from '../components/States';

export function CollegesPage() {
  const { navigate } = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('colleges').select('*').order('rating', { ascending: false });
      setColleges(data || []);
      setLoading(false);
    })();
  }, []);

  const states = [...new Set(colleges.map((c) => c.state).filter(Boolean))] as string[];
  const types = [...new Set(colleges.map((c) => c.type).filter(Boolean))] as string[];

  const filtered = colleges.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && c.type !== typeFilter) return false;
    if (stateFilter && c.state !== stateFilter) return false;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Explore Colleges</h1>
        <p className="mt-2 text-slate-500">Compare top colleges and find the right fit for you</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input w-auto min-w-[120px]">
          <option value="">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="input w-auto min-w-[120px]">
          <option value="">All States</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Building2 className="h-12 w-12" />} title="No colleges found" description="Try adjusting your filters" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((college) => (
            <button
              key={college.id}
              onClick={() => navigate(`/colleges/${college.slug}`)}
              className="card group overflow-hidden text-left"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                {college.image_url && (
                  <img
                    src={college.image_url}
                    alt={college.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="badge bg-white/90 text-slate-700 backdrop-blur-sm">{college.type}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-primary-700 line-clamp-2">
                  {college.name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {college.city}, {college.state}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={college.rating} />
                    <span className="text-sm font-medium text-slate-700">{college.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">({college.total_reviews})</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
