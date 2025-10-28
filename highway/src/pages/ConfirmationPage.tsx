import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '../components/Header';

function ConfirmationPage() {
  const { referenceId } = useParams<{ referenceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state as any;

  const handleBackToHome = () => {
    navigate('/');
  };
  return (
    <div>
      <Header showSearch={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-2">Your experience has been successfully booked</p>
            <p className="text-2xl font-bold text-yellow-600">Ref ID: {referenceId}</p>
          </div>

          {bookingData && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-gray-900">{bookingData.experience.title}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900">{bookingData.experience.location}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(bookingData.slot.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">{bookingData.slot.time}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold text-gray-900">{bookingData.quantity} {bookingData.quantity > 1 ? 'people' : 'person'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">₹{bookingData.total}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ A confirmation email has been sent to your email address</li>
              <li>✓ Please arrive 15 minutes before your scheduled time</li>
              <li>✓ Bring your reference ID: <strong>{referenceId}</strong></li>
              <li>✓ Don't forget to bring a valid ID proof</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBackToHome}
              className="flex-1 px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Book Another Experience
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConfirmationPage;
