import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { BookingDetails } from '../App';
import { apiService } from '../services/api';

function CheckoutPage() {
  const { slotId } = useParams<{ slotId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as BookingDetails & { slotId: string };
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!bookingDetails) {
    navigate('/');
    return null;
  }

  const subtotal = bookingDetails.subtotal;
  const taxes = Math.round((subtotal - discount) * 0.059);
  const total = subtotal - discount + taxes;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      return;
    }

    try {
      const result = await apiService.validatePromoCode(promoCode, subtotal);
      setDiscount(result.discount);
      setPromoApplied(true);
      setPromoMessage(`✓ ${promoCode} applied! You saved ₹${result.discount}`);
    } catch (error) {
      setDiscount(0);
      setPromoApplied(false);
      setPromoMessage('Invalid or expired promo code');
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !agreedToTerms) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.createBooking({
        experienceId: bookingDetails.experience.id,
        slotId: bookingDetails.slotId,
        fullName,
        email,
        quantity: bookingDetails.quantity,
        promoCode: promoApplied ? promoCode : undefined,
      });

      navigate(`/confirmation/${response.referenceId}`, {
        state: response
      });
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header showSearch={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Checkout</span>
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Promo code (optional)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g., SAVE10)"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoMessage('');
                    }}
                    disabled={promoApplied}
                    className="flex-1 px-4 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode.trim()}
                    className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoMessage && (
                  <p className={`mt-2 text-sm ${promoApplied ? 'text-green-600' : 'text-red-600'}`}>
                    {promoMessage}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Try: SAVE10 (10% off), FLAT100 (₹100 off), WELCOME20 (20% off)
                </p>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Experience</span>
                  <span className="font-medium text-gray-900">{bookingDetails.experience.title}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(bookingDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Time</span>
                  <span className="font-medium text-gray-900">{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Qty</span>
                  <span className="font-medium text-gray-900">{bookingDetails.quantity}</span>
                </div>
                <div className="flex justify-between text-gray-600 pt-3 border-t border-gray-200">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Taxes (5.9%)</span>
                  <span className="font-medium text-gray-900">₹{taxes}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6 pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{total}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!fullName || !email || !agreedToTerms || loading}
                className={`w-full py-3 font-medium rounded-lg transition-colors ${
                  fullName && email && agreedToTerms && !loading
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;
