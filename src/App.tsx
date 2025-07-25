import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Activities from './pages/Activities';
import ActivityDetail from "./pages/ActivityDetail";
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Upgrade from './pages/Upgrade';
import Bonus from './pages/Bonus';
import Testimonials from './pages/Testimonials';
import AtividadePublica from "./pages/AtividadePublica";
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';
import Contato from './pages/Contato';
import Licoes from "./pages/Licoes";
import ModeloPadrao from "./pages/ModeloPadrao";

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import LessonsAdmin from './pages/admin/LessonsAdmin';
import AddLesson from './pages/admin/AddLesson';
import ActivitiesAdmin from './pages/admin/ActivitiesAdmin';
import Logs from './pages/admin/Logs';
import AddOrEditActivity from './pages/admin/AddOrEditActivity';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
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
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>

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