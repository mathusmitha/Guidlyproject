import { useEffect, useState } from 'react';
import {
  ArrowLeft, Clock, IndianRupee, Briefcase, CheckCircle2, Building2, ArrowRight,
} from 'lucide-react';
import { supabase, type Course, type Stream, type College, type CollegeCourse } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { getStreamIcon, formatINR } from '../lib/utils';
import { Loading, EmptyState } from '../components/States';

type CollegeWithFees = College & { annual_fees: number | null; eligibility: string | null; seats: number | null };

export function CourseDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [stream, setStream] = useState<Stream | null>(null);
  const [colleges, setColleges] = useState<CollegeWithFees[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('courses').select('*').eq('slug', slug).single();
      if (!c) { setLoading(false); return; }
      setCourse(c);

      if (c.stream_id) {
        const { data: s } = await supabase.from('streams').select('*').eq('id', c.stream_id).single();
        setStream(s);
      }

      const { data: cc } = await supabase
        .from('college_courses')
        .select('*, colleges(*)')
        .eq('course_id', c.id);

      if (cc) {
        const mapped = cc
          .map((item: CollegeCourse & { colleges: College }) => ({
            ...item.colleges,
            annual_fees: item.annual_fees,
            eligibility: item.eligibility,
            seats: item.seats,
          }))
          .sort((a, b) => b.rating - a.rating);
        setColleges(mapped);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <Loading />;
  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState title="Course not found" description="The course you're looking for doesn't exist." />
      </div>
    );
  }

  const Icon = getStreamIcon(stream?.icon || null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <button onClick={() => navigate('/courses')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </button>

      {/* Header */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-primary-50 text-primary-700">{course.level}</span>
              {stream && <span className="badge bg-slate-100 text-slate-600">{stream.name}</span>}
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl">{course.name}</h1>
            <p className="mt-2 text-slate-500">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{course.duration_years} years</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <IndianRupee className="h-4 w-4 text-slate-400" />
                <span>Avg. {formatINR(course.avg_fees)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Skills & Prospects */}
        <div className="space-y-6 lg:col-span-2">
          {course.skills_gained && course.skills_gained.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">Skills You'll Gain</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.skills_gained.map((skill) => (
                  <span key={skill} className="badge bg-primary-50 text-primary-700 px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {course.career_prospects && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">Career Prospects</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.career_prospects}</p>
            </div>
          )}

          {/* Colleges offering this course */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Colleges Offering This Course
            </h2>
            {colleges.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No colleges listed yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {colleges.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => navigate(`/colleges/${college.slug}`)}
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">{college.name}</h3>
                        <p className="text-sm text-slate-500">{college.city}, {college.state}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{formatINR(college.annual_fees)}/yr</p>
                      {college.eligibility && (
                        <p className="text-xs text-slate-400">{college.eligibility}</p>
                      )}
                      <ArrowRight className="ml-auto mt-1 h-4 w-4 text-slate-300 group-hover:text-primary-600" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-slate-900">Quick Facts</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Level</dt>
                <dd className="font-medium text-slate-900">{course.level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Duration</dt>
                <dd className="font-medium text-slate-900">{course.duration_years} years</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Avg. Fees</dt>
                <dd className="font-medium text-slate-900">{formatINR(course.avg_fees)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Stream</dt>
                <dd className="font-medium text-slate-900">{stream?.name || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          <div className="card bg-gradient-to-br from-primary-50 to-accent-50 p-6">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <h3 className="mt-3 font-display text-base font-semibold text-slate-900">Explore Career Paths</h3>
            <p className="mt-1 text-sm text-slate-500">See where this course can lead you.</p>
            <button onClick={() => navigate('/careers')} className="btn-primary mt-4 w-full">
              View Career Paths <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
