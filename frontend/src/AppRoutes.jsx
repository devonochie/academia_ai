import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from './firebase/context/AuthContext';
import { setUser } from './features/auth/authSlice';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';
import Layout from './components/ai-tutor/Layout';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import Dialog from '@mui/material/Dialog';
import { loadUser } from './features/auth/authThunk';
import AssessmentResult from './components/ai-tutor/AssessmentResults';
import AssessmentView from './components/ai-tutor/AssessmentView';
import ParaphraserPage from './pages/parpahraser/ParaphraserPage';


// Lazy-loaded pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/DashBoard'));
const CurriculumCreation = React.lazy(() => import('./pages/tutor/CurriculumCreation'));
const CurriculumPage = React.lazy(() => import('./pages/tutor/CurriculumPage'));
const CurriculumContent = React.lazy(() => import('./pages/tutor/CurriculumContent'));
const LessonPage = React.lazy(() => import('./pages/tutor/LessonPage'));
const RecommendationsPage = React.lazy(() => import('./pages/tutor/RecommendationsPage'));

export default function AppRoute() {
  const dispatch = useDispatch();
  const { firebaseUser } = React.useContext(AuthContext);
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Handle user authentication state
  useEffect(() => {
    if (firebaseUser && !user) {
      dispatch(setUser({
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || null,
        role: 'Firebase User',
        lastLogin: new Date().toISOString(),
      }));
    } else if (!firebaseUser && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, firebaseUser, user]);

  // Handle auth dialog visibility
  useEffect(() => {
    setDialogOpen(['/login', '/register'].includes(location.pathname));
  }, [location.pathname]);

  if (isLoading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <React.Suspense fallback={<Loader fullscreen />}>
        <Routes>
          {/* Auth Routes (in dialogs) */}
          <Route
            path="/login"
            element={
              <AuthDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <Login />
              </AuthDialog>
            }
          />
          <Route
            path="/register"
            element={
              <AuthDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <Register />
              </AuthDialog>
            }
          />
          
          {/* Public Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Main Layout Routes */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Curriculum Routes */}
              <Route path="/curriculum">
                <Route index element={<CurriculumCreation />} />
                <Route path=":id" element={<CurriculumPage />} />
                <Route path=":id/lesson/:lessonId/practice" element={<AssessmentView />} />
              </Route>

              <Route path="/lessons">
                <Route path=":curriculum_id/:lesson_id" element={<LessonPage />} />
                <Route path="assessment/results" element={<AssessmentResult/>} />
              </Route>
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path='/paraphraser' element={<ParaphraserPage />} />
            </Route>
          </Route>
          
          {/* Error Routes */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
          
        </Routes>
      </React.Suspense>
    </div>
  );
}

// Reusable Auth Dialog Component
const AuthDialog = ({ open, onClose, children }) => (
  <Dialog 
    open={open} 
    onClose={onClose} 
    fullWidth 
    maxWidth="xs"
    PaperProps={{ sx: { p: 2 } }}
  >
    {children}
  </Dialog>
);