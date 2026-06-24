import { useEffect, useState } from 'react';
import { Search, Filter, ArrowRight, BookOpen } from 'lucide-react';
import { supabase, type Course, type Stream } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { getStreamIcon, formatINR } from '../lib/utils';
import { Loading, EmptyState } from '../components/States';

export function CoursesPage() {
  const { navigate, route } = useRouter();
  const initialStream = route.params.stream || '';
  const [courses, setCourses] = useState<Course[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState(initialStream);
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([
        supabase.from('courses').select('*').order('name'),
        supabase.from('streams').select('*').order('name'),
      ]);
      setCourses(c.data || []);
      setStreams(s.data || []);
      setLoading(false);
    })();
  }, []);

  const streamMap = new Map(streams.map((s) => [s.id, s]));

  const filtered = courses.filter((course) => {
    if (search && !course.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (streamFilter) {
      const stream = streams.find((s) => s.slug === streamFilter);
      if (stream && course.stream_id !== stream.id) return false;
    }
    if (levelFilter && course.level !== levelFilter) return false;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Explore Courses</h1>
        <p className="mt-2 text-slate-500">Find the right program for your interests and career goals</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="input w-auto min-w-[140px]"
          >
            <option value="">All Streams</option>
            {streams.map((s) => (
              <option key={s.id} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="input w-auto min-w-[100px]"
          >
            <option value="">All Levels</option>
            <option value="UG">UG</option>
            <option value="PG">PG</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="No courses found"
          description="Try adjusting your filters or search query"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const stream = course.stream_id ? streamMap.get(course.stream_id) : null;
            const Icon = getStreamIcon(stream?.icon || null);
            return (
              <button
                key={course.id}
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="card group p-5 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="badge bg-slate-100 text-slate-600">{course.level}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-slate-900 group-hover:text-primary-700">
                  {course.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description}</p>
                {course.skills_gained && course.skills_gained.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.skills_gained.slice(0, 3).map((skill) => (
                      <span key={skill} className="badge bg-primary-50 text-primary-700">{skill}</span>
                    ))}
                    {course.skills_gained.length > 3 && (
                      <span className="badge bg-slate-100 text-slate-500">
                        +{course.skills_gained.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{course.duration_years} yrs</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{formatINR(course.avg_fees)}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
