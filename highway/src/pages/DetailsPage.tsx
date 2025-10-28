import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import Header from '../components/Header';
import { Experience } from '../App';
import { apiService, Slot } from '../services/api';

interface SlotsByDate {
  [date: string]: Slot[];
}

function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch experience details
        const expData = await apiService.getExperienceById(id);
        setExperience(expData);
        
        // Fetch slots
        const slots = await apiService.getExperienceSlots(id);
        
        // Group slots by date
        const grouped: SlotsByDate = {};
        slots.forEach((slot) => {
          const dateStr = new Date(slot.date).toISOString().split('T')[0];
          if (!grouped[dateStr]) {
            grouped[dateStr] = [];
          }
          grouped[dateStr].push(slot);
        });

        setSlotsByDate(grouped);
        const dates = Object.keys(grouped).sort();
        setAvailableDates(dates);
        
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
          const firstDateSlots = grouped[dates[0]];
          if (firstDateSlots.length > 0 && firstDateSlots[0].availableSlots > 0) {
            setSelectedSlot(firstDateSlots[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const currentDateSlots = selectedDate ? slotsByDate[selectedDate] || [] : [];

  if (!experience) {
    return null;
  }

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.059);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!selectedSlot) return;
    navigate(`/checkout/${selectedSlot.id}`, {
      state: {
        experience,
        date: selectedDate,
        time: selectedSlot.time,
        quantity,
        subtotal,
        taxes,
        total,
        slotId: selectedSlot.id,
      }
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const slotsForDate = slotsByDate[date] || [];
    if (slotsForDate.length > 0 && slotsForDate[0].availableSlots > 0) {
      setSelectedSlot(slotsForDate[0]);
    } else {
      setSelectedSlot(null);
    }
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
          <span className="font-medium">Details</span>
        </button>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading availability...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                <img
                  src={experience.imageUrl}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">{experience.description}</p>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose date</h2>
                <div className="flex flex-wrap gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateChange(date)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        selectedDate === date
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
                {availableDates.length === 0 && (
                  <p className="text-gray-500 mt-2">No dates available</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose time</h2>
                <div className="flex flex-wrap gap-3">
                  {currentDateSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.availableSlots > 0 && setSelectedSlot(slot)}
                      disabled={slot.availableSlots === 0}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors min-w-[140px] ${
                        slot.availableSlots === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : selectedSlot?.id === slot.id
                          ? 'bg-yellow-400 text-black'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot.time}</span>
                        <span className={`text-xs ml-2 ${
                          slot.availableSlots === 0 ? 'text-gray-500' : 'text-red-600'
                        }`}>
                          {slot.availableSlots === 0 ? 'Sold out' : `${slot.availableSlots} left`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {currentDateSlots.length === 0 && selectedDate && (
                  <p className="text-gray-500 mt-2">No time slots available for this date</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-gray-600">Starts at</span>
                  <span className="text-2xl font-bold text-gray-900">₹{experience.price}</span>
                </div>

                <div className="mb-4">
                  <span className="text-gray-900 font-medium mb-2 block">Quantity</span>
                  <div className="flex items-center justify-between bg-white rounded-lg p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => selectedSlot && quantity < selectedSlot.availableSlots && setQuantity(quantity + 1)}
                      disabled={!selectedSlot || quantity >= selectedSlot.availableSlots}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedSlot && quantity >= selectedSlot.availableSlots && (
                    <p className="text-xs text-red-600 mt-1">Maximum {selectedSlot.availableSlots} available</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span>₹{taxes}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6 pt-4 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{total}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot || quantity < 1}
                  className={`w-full py-3 font-medium rounded-lg transition-colors ${
                    selectedSlot && quantity >= 1
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DetailsPage;
