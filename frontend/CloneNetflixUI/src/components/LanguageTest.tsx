import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageTest() {
  const { language, t } = useLanguage();

  return (
    <div className="p-4 m-4 bg-gray-800 rounded-lg text-white">
      <p>Поточна мова: <strong>{language === 'uk' ? 'Українська' : 'English'}</strong></p>
      <p>Тест перекладу: {t('nav.dashboard')}</p>
    </div>
  );
}
