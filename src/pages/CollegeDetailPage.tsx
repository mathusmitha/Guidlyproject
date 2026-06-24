import { useEffect, useState } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Globe, Building2, IndianRupee, ArrowRight, Users,
} from 'lucide-react';
import {
  supabase, type College, type Course, type CollegeCourse, type Review,
} from '../lib/supabase';
import { useRouter } from '../lib/router';
import { formatINR } from '../lib/utils';
import { StarRating } from '../components/StarRating';
import { Loading, EmptyState } from '../components/States';

type CourseWithFees = Course & { annual_fees: number | null; eligibility: string | null; seats: number | null };

export function CollegeDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<CourseWithFees[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from('colleges').select('*').eq('slug', slug).single();
      if (!c) { setLoading(false); return; }
      setCollege(c);

      const { data: cc } = await supabase
        .from('college_courses')
        .select('*, courses(*)')
        .eq('college_id', c.id);

      if (cc) {
        const mapped = cc.map((item: CollegeCourse & { courses: Course }) => ({
          ...item.courses,
          annual_fees: item.annual_fees,
          eligibility: item.eligibility,
          seats: item.seats,
        }));
        setCourses(mapped);
      }

      const { data: r } = await supabase
        .from('reviews')
        .select('*')
        .eq('college_id', c.id)
        .order('created_at', { ascending: false });
      setReviews(r || []);

      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <Loading />;
  if (!college) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState title="College not found" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <button onClick={() => navigate('/colleges')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Colleges
      </button>

      {/* Header */}
      <div className="card overflow-hidden">
        <div className="relative h-56 overflow-hidden bg-slate-200 sm:h-72">
          {college.image_url && (
            <img src={college.image_url} alt={college.name} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-white/90 text-slate-700">{college.type}</span>
              {college.established_year && (
                <span className="badge bg-white/90 text-slate-700">Est. {college.established_year}</span>
              )}
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{college.name}</h1>
            <div className="mt-1 flex items-center gap-1.5 text-white/80">
              <MapPin className="h-4 w-4" /> {college.city}, {college.state}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <StarRating rating={college.rating} size="md" />
            <span className="font-semibold text-slate-900">{college.rating.toFixed(1)}</span>
            <span className="text-sm text-slate-400">({college.total_reviews} reviews)</span>
          </div>
          {college.website_url && (
            <a
              href={college.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Globe className="h-4 w-4" /> Visit Website
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* About */}
          {college.description && (
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{college.description}</p>
            </div>
          )}

          {/* Courses offered */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">Courses Offered</h2>
            {courses.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No courses listed.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.slug}`)}
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50/30"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-700">{course.name}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                        <span className="badge bg-slate-100 text-slate-600">{course.level}</span>
                        {course.duration_years && <span>{course.duration_years} yrs</span>}
                        {course.eligibility && <span className="text-xs">• {course.eligibility}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{formatINR(course.annual_fees)}/yr</p>
                      {course.seats && (
                        <p className="flex items-center justify-end gap-1 text-xs text-slate-400">
                          <Users className="h-3 w-3" /> {course.seats} seats
                        </p>
                      )}
                      <ArrowRight className="ml-auto mt-1 h-4 w-4 text-slate-300 group-hover:text-primary-600" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">Student Reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-slate-400">
                        {new Date(review.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                    {review.title && <h3 className="mt-2 font-semibold text-slate-900">{review.title}</h3>}
                    {review.content && <p className="mt-1 text-sm text-slate-600">{review.content}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-slate-900">Key Info</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-slate-500"><Building2 className="h-4 w-4" /> Type</dt>
                <dd className="font-medium text-slate-900">{college.type || 'N/A'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-slate-500"><MapPin className="h-4 w-4" /> Location</dt>
                <dd className="font-medium text-slate-900">{college.city}, {college.state}</dd>
              </div>
              {college.established_year && (
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-slate-500"><Calendar className="h-4 w-4" /> Established</dt>
                  <dd className="font-medium text-slate-900">{college.established_year}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-slate-500"><IndianRupee className="h-4 w-4" /> Courses</dt>
                <dd className="font-medium text-slate-900">{courses.length} offered</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
