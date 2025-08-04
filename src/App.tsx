import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Layout from './components/Layout';
import { Suspense, lazy } from 'react';
import LoadingSpinner from './components/UI/LoadingSpinner'; // Importa o spinner

// Lazy imports
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

const Home = lazy(() => import('./pages/Home'));
const Lessons = lazy(() => import('./pages/Lessons'));
const LessonDetail = lazy(() => import('./pages/LessonDetail'));
const Activities = lazy(() => import('./pages/Activities'));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Profile = lazy(() => import('./pages/Profile'));
const Upgrade = lazy(() => import('./pages/Upgrade'));
const Bonus = lazy(() => import('./pages/Bonus'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const AtividadePublica = lazy(() => import('./pages/AtividadePublica'));
const Termos = lazy(() => import('./pages/Termos'));
const Privacidade = lazy(() => import('./pages/Privacidade'));
const Contato = lazy(() => import('./pages/Contato'));
const Licoes = lazy(() => import('./pages/Licoes'));
const ModeloPadrao = lazy(() => import('./pages/ModeloPadrao'));
const Sucesso = lazy(() => import('./pages/Sucesso'));

// Admin
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/Users'));
const LessonsAdmin = lazy(() => import('./pages/admin/LessonsAdmin'));
const AddLesson = lazy(() => import('./pages/admin/AddLesson'));
const ActivitiesAdmin = lazy(() => import('./pages/admin/ActivitiesAdmin'));
const Logs = lazy(() => import('./pages/admin/Logs'));
const AddOrEditActivity = lazy(() => import('./pages/admin/AddOrEditActivity'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Suspense com spinner centralizado */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <LoadingSpinner size="lg" className="text-purple-600" />
                </div>
              }
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/recuperar-senha" element={<ForgotPassword />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/licoes" element={<Licoes />} />
                <Route path="/modelopadrao" element={<ModeloPadrao />} />
                <Route path="/sucesso" element={<Sucesso />} />


                {/* Private Routes agrupadas */}
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/licoes/:categoria" element={<Lessons />} />
                  <Route path="/licao/:id" element={<LessonDetail />} />
                  <Route path="/atividades/:categoria" element={<Activities />} />
                  <Route path="/atividade/:id" element={<ActivityDetail />} />
                  <Route path="/atividade/:id" element={<AtividadePublica />} />
                  <Route path="/favoritos" element={<Favorites />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/upgrade" element={<Upgrade />} />
                  <Route path="/bonus" element={<Bonus />} />
                  <Route path="/depoimentos" element={<Testimonials />} />
                </Route>

                {/* Admin Routes agrupadas */}
                <Route element={<PrivateRoute requireAdmin><Layout /></PrivateRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/usuarios" element={<Users />} />
                  <Route path="/licoes-admin" element={<LessonsAdmin />} />
                  <Route path="/adicionar-licao" element={<AddLesson />} />
                  <Route path="/editar-licao/:id" element={<AddLesson />} />
                  <Route path="/atividades-admin" element={<ActivitiesAdmin />} />
                  <Route path="/nova-atividade" element={<AddOrEditActivity />} />
                  <Route path="/editar-atividade/:id" element={<AddOrEditActivity />} />
                  <Route path="/logs" element={<Logs />} />
                </Route>

                {/* Redirect */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Suspense>

            {/* Toaster para notificações */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
