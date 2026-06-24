import { useEffect, useState } from 'react';
import {
  ArrowRight, GraduationCap, Building2, Briefcase, Sparkles, TrendingUp,
  Users, Target, BookOpen, Award,
} from 'lucide-react';
import { supabase, type Stream, type Course, type CareerPath } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { getStreamIcon, formatINR, formatSalary } from '../lib/utils';
import { Loading } from '../components/States';

export function HomePage() {
  const { navigate } = useRouter();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, c, cp] = await Promise.all([
        supabase.from('streams').select('*').order('name'),
        supabase.from('courses').select('*').limit(6),
        supabase.from('career_paths').select('*').limit(4),
      ]);
      setStreams(s.data || []);
      setCourses(c.data || []);
      setCareers(cp.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent-300" />
              Your future, guided with clarity
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find the right course, college & career path
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
              Confused after 12th or your undergraduate degree? Explore courses, compare colleges,
              and discover career paths that match your interests and strengths.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/quiz')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-primary-50 hover:shadow-xl active:scale-[0.98]"
              >
                <Target className="h-5 w-5" />
                Take the Career Quiz
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: BookOpen, label: 'Courses', value: '12+' },
            { icon: Building2, label: 'Colleges', value: '8+' },
            { icon: Briefcase, label: 'Career Paths', value: '8+' },
            { icon: Users, label: 'Students Helped', value: '5,000+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Streams */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="section-title">Browse by Stream</h2>
          <p className="mt-2 text-slate-500">Pick a field that interests you and explore related courses</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {streams.map((stream) => {
            const Icon = getStreamIcon(stream.icon);
            return (
              <button
                key={stream.id}
                onClick={() => navigate(`/courses?stream=${stream.slug}`)}
                className="card group p-5 text-left"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-semibold text-slate-900">{stream.name}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{stream.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Courses */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="section-title">Popular Courses</h2>
              <p className="mt-2 text-slate-500">Most sought-after programs after 12th and UG</p>
            </div>
            <button onClick={() => navigate('/courses')} className="btn-ghost hidden sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="card group p-5 text-left"
              >
                <div className="flex items-start justify-between">
                  <span className="badge bg-primary-50 text-primary-700">{course.level}</span>
                  <span className="text-sm font-medium text-slate-400">
                    {course.duration_years} yrs
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-slate-900 group-hover:text-primary-700">
                  {course.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm text-slate-500">
                    Avg. <span className="font-semibold text-slate-700">{formatINR(course.avg_fees)}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="section-title">Trending Career Paths</h2>
          <p className="mt-2 text-slate-500">See where your education can take you</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {careers.map((career) => (
            <button
              key={career.id}
              onClick={() => navigate(`/careers/${career.slug}`)}
              className="card group p-5 text-left"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-primary-700">
                {career.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{career.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="badge bg-accent-50 text-accent-700">
                  <Award className="h-3 w-3" /> {formatSalary(career.avg_salary)}
                </span>
                <span className={`badge ${
                  career.growth_outlook === 'High'
                    ? 'bg-accent-50 text-accent-700'
                    : 'bg-warning-50 text-warning-600'
                }`}>
                  {career.growth_outlook} growth
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="relative">
              <GraduationCap className="mx-auto h-12 w-12 text-white" />
              <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                Still confused about what to choose?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-primary-100">
                Take our 2-minute career quiz and get personalized recommendations based on your
                interests, strengths, and goals.
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-primary-50 active:scale-[0.98]"
              >
                <Target className="h-5 w-5" />
                Start the Quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
