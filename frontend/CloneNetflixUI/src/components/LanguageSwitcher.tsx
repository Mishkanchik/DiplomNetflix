import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 hover:bg-indigo-900/40 rounded-full p-1">
      <button
        onClick={() => setLanguage('uk')}
        className={`px-4 py-2 rounded-full cursor-pointer font-medium transition-all duration-300 ${language === 'uk'
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-gray-300 hover:text-gray-100'
          }`}
      >
        УК
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full cursor-pointer font-medium transition-all duration-300 ${language === 'en'
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-gray-300 hover:text-gray-100'
          }`}
      >
        EN
      </button>
    </div>
  );
}
