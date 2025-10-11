import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthCallback } from './components/AuthCallback';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { ArchitectureOverview } from './views/ArchitectureOverview';
import { ApplicationTier } from './views/ApplicationTier';
import { Frontend } from './views/Frontend';
import { Users } from './views/Users';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route for auth callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/architecture" element={<ArchitectureOverview />} />
                    <Route path="/application-tier" element={<ApplicationTier />} />
                    <Route path="/frontend" element={<Frontend />} />
                    <Route path="/users" element={<Users />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
