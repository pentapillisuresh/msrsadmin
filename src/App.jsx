// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CSRRequests from './pages/CSRRequests';
import Documents from './pages/Documents';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Volunteers from './pages/Volunteers';
import KnowledgeHub from './pages/KnowledgeHub';
import Media from './pages/Media';
import Team from './pages/Team';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import AccessLogs from './pages/AccessLogs';
import Layout from './components/Layout/Layout';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="csr-requests" element={<CSRRequests />} />
        <Route path="documents" element={<Documents />} />
        <Route path="access-logs" element={<AccessLogs />} />
        <Route path="events" element={<Events />} />
        <Route path="donations" element={<Donations />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="knowledge-hub" element={<KnowledgeHub />} />
        <Route path="media" element={<Media />} />
        <Route path="team" element={<Team />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;