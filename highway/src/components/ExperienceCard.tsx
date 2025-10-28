import { Experience } from '../App';

type ExperienceCardProps = {
  experience: Experience;
  onViewDetails: (experience: Experience) => void;
};

function ExperienceCard({ experience, onViewDetails }: ExperienceCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full whitespace-nowrap ml-2">
            {experience.location}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {experience.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-sm text-gray-500 mr-1">From</span>
            <span className="text-2xl font-bold text-gray-900">₹{experience.price}</span>
          </div>
          <button
            onClick={() => onViewDetails(experience)}
            className="px-4 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
