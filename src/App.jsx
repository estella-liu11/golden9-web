import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Shop from './pages/Shop';
import Leaderboard from './pages/Leaderboard';
import Membership from './pages/Membership';
import Coach from './pages/Coach';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with Header and Footer */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <Events />
            </Layout>
          }
        />
        <Route
          path="/shop"
          element={
            <Layout>
              <Shop />
            </Layout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Layout>
              <Leaderboard />
            </Layout>
          }
        />
        <Route
          path="/membership"
          element={
            <Layout>
              <Membership />
            </Layout>
          }
        />
        <Route
          path="/coach"
          element={
            <Layout>
              <Coach />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
