import { useEffect, useState } from 'react';
import {
  ArrowLeft, TrendingUp, Award, Briefcase, CheckCircle2, ArrowRight, BookOpen,
} from 'lucide-react';
import { supabase, type CareerPath, type Course } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { formatSalary, formatINR } from '../lib/utils';
import { Loading, EmptyState } from '../components/States';

export function CareerDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [career, setCareer] = useState<CareerPath | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('career_paths').select('*').eq('slug', slug).single();
      if (!c) { setLoading(false); return; }
      setCareer(c);

      if (c.recommended_courses && c.recommended_courses.length > 0) {
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .in('id', c.recommended_courses);
        setCourses(courseData || []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <Loading />;
  if (!career) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState title="Career path not found" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <button onClick={() => navigate('/careers')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Career Paths
      </button>

      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${
                career.growth_outlook === 'High'
                  ? 'bg-accent-50 text-accent-700'
                  : 'bg-warning-50 text-warning-600'
              }`}>
                {career.growth_outlook} growth
              </span>
              <span className="badge bg-primary-50 text-primary-700">
                <Award className="h-3 w-3" /> {formatSalary(career.avg_salary)}
              </span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl">{career.title}</h1>
            <p className="mt-2 text-slate-500">{career.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {career.skills_required && career.skills_required.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">Skills Required</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {career.skills_required.map((skill) => (
                  <span key={skill} className="badge bg-accent-50 text-accent-700 px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {career.industries && career.industries.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">Industries</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {career.industries.map((ind) => (
                  <span key={ind} className="badge bg-slate-100 text-slate-600 px-3 py-1">
                    <Briefcase className="h-3.5 w-3.5" /> {ind}
                  </span>
                ))}
              </div>
            </div>
          )}

          {courses.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">Recommended Courses</h2>
              <div className="mt-4 space-y-3">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.slug}`)}
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">{course.name}</h3>
                        <p className="text-sm text-slate-500">{course.duration_years} years • {formatINR(course.avg_fees)}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 group-hover:text-primary-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card bg-gradient-to-br from-accent-50 to-primary-50 p-6">
            <Award className="h-8 w-8 text-primary-600" />
            <h3 className="mt-3 font-display text-base font-semibold text-slate-900">Salary & Outlook</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Avg. Salary</dt>
                <dd className="font-semibold text-slate-900">{formatSalary(career.avg_salary)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Growth</dt>
                <dd className="font-semibold text-slate-900">{career.growth_outlook}</dd>
              </div>
            </dl>
            <button onClick={() => navigate('/colleges')} className="btn-primary mt-4 w-full">
              Find Colleges <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
