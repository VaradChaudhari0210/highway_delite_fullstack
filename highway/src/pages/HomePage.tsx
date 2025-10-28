import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ExperienceCard from '../components/ExperienceCard';
import { Experience } from '../App';
import { apiService } from '../services/api';

function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await apiService.getExperiences();
        setExperiences(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load experiences. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleViewDetails = (experience: Experience) => {
    navigate(`/experience/${experience.id}`);
  };

  const filteredExperiences = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <Header searchValue={searchValue} onSearchChange={setSearchValue} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading experiences...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              Make sure the backend is running: <code className="bg-red-100 px-2 py-1 rounded">cd backend && npm run dev</code>
            </p>
          </div>
        )}

        {!loading && !error && filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No experiences found.</p>
          </div>
        )}

        {!loading && !error && filteredExperiences.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
