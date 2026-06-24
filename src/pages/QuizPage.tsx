import { useState } from 'react';
import {
  Target, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, TrendingUp, Award,
  BookOpen, Sparkles,
} from 'lucide-react';
import { supabase, type CareerPath, type Course, type Stream } from '../lib/supabase';
import { useRouter } from '../lib/router';
import { formatSalary, formatINR, getStreamIcon } from '../lib/utils';
import { Loading } from '../components/States';

type Question = {
  id: number;
  question: string;
  options: { label: string; value: string }[];
};

const questions: Question[] = [
  {
    id: 1,
    question: 'Which subjects did you enjoy most in school/college?',
    options: [
      { label: 'Math & Physics', value: 'engineering' },
      { label: 'Biology & Chemistry', value: 'medical' },
      { label: 'Accountancy & Economics', value: 'commerce' },
      { label: 'Literature & Social Studies', value: 'arts' },
      { label: 'Pure Science & Research', value: 'science' },
    ],
  },
  {
    id: 2,
    question: 'What kind of work excites you the most?',
    options: [
      { label: 'Building & fixing things', value: 'engineering' },
      { label: 'Helping & caring for people', value: 'medical' },
      { label: 'Managing money & business', value: 'commerce' },
      { label: 'Writing & creative expression', value: 'arts' },
      { label: 'Analyzing data & experiments', value: 'science' },
      { label: 'Designing & visual creation', value: 'design' },
      { label: 'Arguing & advocating for justice', value: 'law' },
    ],
  },
  {
    id: 3,
    question: 'How long are you willing to study after 12th/UG?',
    options: [
      { label: '3 years', value: 'short' },
      { label: '4 years', value: 'medium' },
      { label: '5+ years', value: 'long' },
    ],
  },
  {
    id: 4,
    question: 'What matters most to you in a career?',
    options: [
      { label: 'High salary', value: 'salary' },
      { label: 'Job stability', value: 'stability' },
      { label: 'Passion & interest', value: 'passion' },
      { label: 'Social impact', value: 'impact' },
      { label: 'Creativity & freedom', value: 'creativity' },
    ],
  },
  {
    id: 5,
    question: 'Which environment would you thrive in?',
    options: [
      { label: 'Tech office / lab', value: 'engineering' },
      { label: 'Hospital / clinic', value: 'medical' },
      { label: 'Corporate office', value: 'commerce' },
      { label: 'Studio / fieldwork', value: 'arts' },
      { label: 'Research institution', value: 'science' },
      { label: 'Courtroom / firm', value: 'law' },
      { label: 'Design studio', value: 'design' },
    ],
  },
];

const streamSlugMap: Record<string, string> = {
  engineering: 'engineering',
  medical: 'medical',
  commerce: 'commerce',
  arts: 'arts',
  science: 'science',
  law: 'law',
  design: 'design',
};

export function QuizPage() {
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<{
    streams: Stream[];
    courses: Course[];
    careers: CareerPath[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[step].id]: value });
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      calculateResults({ ...answers, [questions[step].id]: value });
    }
  };

  const calculateResults = async (allAnswers: Record<number, string>) => {
    setLoading(true);
    const streamSlugs = Object.values(allAnswers).filter((v) => streamSlugMap[v]);
    const uniqueSlugs = [...new Set(streamSlugs.map((v) => streamSlugMap[v]))];

    let streamResults: Stream[] = [];
    let courseResults: Course[] = [];
    let careerResults: CareerPath[] = [];

    if (uniqueSlugs.length > 0) {
      const { data: streams } = await supabase
        .from('streams')
        .select('*')
        .in('slug', uniqueSlugs);
      streamResults = streams || [];

      const streamIds = streamResults.map((s) => s.id);
      if (streamIds.length > 0) {
        const { data: courses } = await supabase
          .from('courses')
          .select('*')
          .in('stream_id', streamIds)
          .order('avg_fees');
        courseResults = courses || [];
      }
    }

    const { data: careers } = await supabase
      .from('career_paths')
      .select('*')
      .order('avg_salary', { ascending: false });
    careerResults = careers || [];

    const priorityValue = allAnswers[4];
    if (priorityValue === 'salary') {
      careerResults.sort((a, b) => (b.avg_salary || 0) - (a.avg_salary || 0));
    } else if (priorityValue === 'impact') {
      careerResults = careerResults.filter((c) =>
        c.industries?.some((i) => /health|social|public|education/i.test(i))
      ).concat(careerResults.filter((c) =>
        !c.industries?.some((i) => /health|social|public|education/i.test(i))
      ));
    }

    setResults({ streams: streamResults, courses: courseResults.slice(0, 4), careers: careerResults.slice(0, 4) });
    setLoading(false);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  if (loading) return <Loading message="Analyzing your answers..." />;

  if (results) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Your Personalized Results</h1>
          <p className="mt-2 text-slate-500">Based on your answers, here are our recommendations</p>
        </div>

        {results.streams.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-slate-900">Recommended Streams</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.streams.map((stream) => {
                const Icon = getStreamIcon(stream.icon);
                return (
                  <div key={stream.id} className="card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{stream.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{stream.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {results.courses.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-display text-xl font-semibold text-slate-900">Recommended Courses</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.slug}`)}
                  className="card group p-5 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="badge bg-slate-100 text-slate-600">{course.level}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold text-slate-900 group-hover:text-primary-700">
                    {course.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-sm text-slate-500">{course.duration_years} yrs • {formatINR(course.avg_fees)}</span>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 group-hover:text-primary-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-semibold text-slate-900">Career Paths to Consider</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.careers.map((career) => (
              <button
                key={career.id}
                onClick={() => navigate(`/careers/${career.slug}`)}
                className="card group p-5 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className={`badge ${
                    career.growth_outlook === 'High'
                      ? 'bg-accent-50 text-accent-700'
                      : 'bg-warning-50 text-warning-600'
                  }`}>
                    {career.growth_outlook}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900 group-hover:text-primary-700">
                  {career.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{career.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="badge bg-primary-50 text-primary-700">
                    <Award className="h-3 w-3" /> {formatSalary(career.avg_salary)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button onClick={restart} className="btn-secondary">
            <RotateCcw className="h-4 w-4" /> Retake Quiz
          </button>
          <button onClick={() => navigate('/colleges')} className="btn-primary">
            Explore Colleges <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const current = questions[step];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
          <Target className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Career Guidance Quiz</h1>
        <p className="mt-2 text-slate-500">Answer {totalSteps} quick questions to get personalized recommendations</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">Question {step + 1} of {totalSteps}</span>
          <span className="text-slate-400">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={current.id} className="card animate-scale-in p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-slate-900">{current.question}</h2>
        <div className="mt-6 space-y-3">
          {current.options.map((option) => {
            const isSelected = answers[current.id] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                }`}
              >
                <span className={`font-medium ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>
                  {option.label}
                </span>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-primary-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className="btn-ghost disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>
        <span className="text-sm text-slate-400">Tap an option to continue</span>
      </div>
    </div>
  );
}
