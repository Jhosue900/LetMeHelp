import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { FindHelpPage } from '@/pages/FindHelpPage';
import { HelperProfilePage } from '@/pages/HelperProfilePage';
import { QuieroAyudarPage } from '@/pages/QuieroAyudarPage';
import { ConfirmationPage } from '@/pages/ConfirmationPage';
import { ManagePage } from '@/pages/ManagePage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/encontrar-ayuda" element={<FindHelpPage />} />
            <Route path="/helper/:id" element={<HelperProfilePage />} />
            <Route path="/quiero-ayudar" element={<QuieroAyudarPage />} />
            <Route path="/confirmacion" element={<ConfirmationPage />} />
            <Route path="/administrar/:token" element={<ManagePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;