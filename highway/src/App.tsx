import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';

export type { Experience, BookingDetails } from './types';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experience/:id" element={<DetailsPage />} />
          <Route path="/checkout/:slotId" element={<CheckoutPage />} />
          <Route path="/confirmation/:referenceId" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
