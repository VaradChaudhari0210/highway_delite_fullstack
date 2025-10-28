import { MapPin } from 'lucide-react';

type HeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
};

function Header({ searchValue = '', onSearchChange, showSearch = true }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-tight">highway</span>
              <span className="text-lg font-semibold leading-tight">delite</span>
            </div>
          </div>

          {showSearch && (
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-80 px-4 py-2.5 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button className="px-6 py-2.5 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors">
                Search
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
