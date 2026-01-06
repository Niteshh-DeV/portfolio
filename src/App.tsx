import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Poetry } from './components/Poetry';
import { MagneticCursor } from './components/MagneticCursor';

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <MagneticCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/poetry" element={<Poetry onClose={() => navigate('/')} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}