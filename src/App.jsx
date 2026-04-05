import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { initHandLandmarker } from './utils/visionModel';
import AppShell from './components/layout/AppShell';
import RegistrationPage from './pages/Registration';
import HomePage from './pages/Home';
import OrderPage from './pages/Order';
import WaitingPage from './pages/Waiting';
import ShopPage from './pages/Shop';
import CardDeckPage from './pages/CardDeck';
import StatsPage from './pages/Stats';
import SupportPage from './pages/Support';

function ProtectedRoute({ children }) {
  const isRegistered = useGameStore((s) => s.isRegistered);
  if (!isRegistered) return <Navigate to="/register" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    initHandLandmarker();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/waiting" element={<WaitingPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/deck" element={<CardDeckPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
