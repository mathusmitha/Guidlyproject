import { RouterProvider, useRouter } from './lib/router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CollegesPage } from './pages/CollegesPage';
import { CollegeDetailPage } from './pages/CollegeDetailPage';
import { CareersPage } from './pages/CareersPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { QuizPage } from './pages/QuizPage';

function Routes() {
  const { route } = useRouter();

  switch (route.path) {
    case '/':
      return <HomePage />;
    case '/courses':
      return <CoursesPage />;
    case '/courses/:id':
      return <CourseDetailPage slug={route.params.id} />;
    case '/colleges':
      return <CollegesPage />;
    case '/colleges/:id':
      return <CollegeDetailPage slug={route.params.id} />;
    case '/careers':
      return <CareersPage />;
    case '/careers/:id':
      return <CareerDetailPage slug={route.params.id} />;
    case '/quiz':
      return <QuizPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <RouterProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes />
        </main>
        <Footer />
      </div>
    </RouterProvider>
  );
}

export default App;
