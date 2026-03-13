import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutHelp: React.FC = () => {
  const { t, language } = useLanguage();

  const faqList = [
    'aboutHelp.faq1',
    'aboutHelp.faq2',
    'aboutHelp.faq3',
    'aboutHelp.faq4',
  ];

  const faqAnswers: {
    [key in 'aboutHelp.faq1' | 'aboutHelp.faq2' | 'aboutHelp.faq3' | 'aboutHelp.faq4']: {
      ua: string;
      en: string;
    }
  } = {
    'aboutHelp.faq1': {
      ua: 'Щоб змінити мову сайту, скористайтесь перемикачем мов у верхньому меню.',
      en: 'To change the site language, use the language switcher in the top menu.'
    },
    'aboutHelp.faq2': {
      ua: 'Додати фільм у "Вибране" можна натиснувши на іконку серця на сторінці фільму.',
      en: 'To add a movie to "Favorites", click the heart icon on the movie page.'
    },
    'aboutHelp.faq3': {
      ua: 'Історію переглядів можна переглянути у розділі "Історія переглядів" у профілі.',
      en: 'You can view your watch history in the "Watch History" section in your profile.'
    },
    'aboutHelp.faq4': {
      ua: 'Оформити підписку можна у розділі "Підписки" у профілі користувача.',
      en: 'You can subscribe in the "Subscriptions" section in your profile.'
    }
  };

  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeFaq, setActiveFaq] = React.useState<string | null>(null);

  const handleFaqClick = (key: string) => {
    // Плавно прокручувати сторінку до центру перед відкриттям модалки
    window.scrollTo({
      top: document.body.scrollHeight / 2 - window.innerHeight / 2,
      behavior: 'smooth'
    });

    // Невелика затримка, щоб скрол завершився перед відкриттям модалки
    setTimeout(() => {
      setActiveFaq(key);
      setModalOpen(true);
    }, 400); // 400ms — достатньо для плавного скролу
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveFaq(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 text-white flex items-center justify-center py-16 px-5 sm:px-8">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 sm:p-12 md:p-16 relative overflow-hidden">
        {/* Декоративна лінія зверху */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500" />

        {/* Заголовок + іконка */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse-slow" />
            <svg
              width="80"
              height="80"
              fill="none"
              viewBox="0 0 24 24"
              className="relative text-indigo-400 drop-shadow-xl"
            >
              <path
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14v-4m0-4h.01"
              />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent mb-5 tracking-tight">
            {t('aboutHelp.title')}
          </h1>

          <p className="text-lg sm:text-xl text-gray-300/90 font-light max-w-2xl leading-relaxed">
            {t('aboutHelp.description')}
          </p>
        </div>

        {/* Контакти */}
        <div className="mb-14 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-purple-400">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4.5m18 0V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7.5m18 0-9 6.75m-9-6.75 9 6.75"
              />
            </svg>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              {t('aboutHelp.contact')}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4 text-lg text-gray-200/90">
            <div className="flex items-center gap-3">
              <span className="font-medium">Email:</span>
              <a href="mailto:support@nexocinema.com" className="hover:text-purple-300 transition-colors underline underline-offset-4">
                support@nexocinema.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">Telegram:</span>
              <a
                href="https://t.me/nexo_support"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-300 transition-colors underline underline-offset-4"
              >
                @nexo_support
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">Instagram:</span>
              <a
                href="https://instagram.com/nexo.cinema"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-300 transition-colors underline underline-offset-4"
              >
                @nexo.cinema
              </a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-indigo-400">
              <path
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2"
              />
            </svg>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t('aboutHelp.faq')}
            </h2>
          </div>

          <div className="space-y-5">
            {faqList.map((key, idx) => (
              <div
                key={key}
                onClick={() => handleFaqClick(key)}
                className="group bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-fuchsia-900/30 rounded-2xl p-6 border border-white/5 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 backdrop-blur-sm"
              >
                <div className="flex items-start gap-5">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </span>
                  <span className="text-gray-100 text-lg font-medium leading-relaxed group-hover:text-white transition-colors">
                    {t(key)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Фінальний блок */}
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
            {t('aboutHelp.finalTitle')}
          </h3>
          <p className="text-gray-300 text-lg mb-3 max-w-2xl mx-auto">
            {t('aboutHelp.finalDesc')}
          </p>
          <p className="text-gray-500 text-sm italic">
            {t('aboutHelp.finalCopyright')}
          </p>
        </div>

        {/* Модальне вікно — full-width, фіксована висота, без скролу */}
        {modalOpen && activeFaq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6">
            <div className="
              bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 
              rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 
              w-full max-w-[96vw] sm:max-w-[92vw] md:max-w-[88vw] lg:max-w-4xl 
              max-h-[90vh] sm:max-h-[88vh] md:max-h-[85vh] 
              overflow-hidden relative animate-fadeInScale
            ">
              {/* Кнопка закриття */}
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 text-gray-300 hover:text-white text-3xl sm:text-4xl font-bold transition-colors z-20"
                aria-label="Закрити"
              >
                ×
              </button>

              {/* Контент — фіксована висота, без скролу */}
              <div className="h-full flex flex-col p-5 sm:p-7 md:p-9 lg:p-12">
                <h3 className="
                  text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                  font-extrabold 
                  bg-gradient-to-r from-indigo-300 to-purple-300 
                  bg-clip-text text-transparent 
                  mb-3 sm:mb-4 md:mb-5 lg:mb-6
                  leading-tight
                ">
                  {t(activeFaq)}
                </h3>

                <p className="
                  text-sm sm:text-base md:text-lg lg:text-xl 
                  text-gray-200 leading-relaxed 
                  flex-1 overflow-hidden
                  break-words whitespace-pre-wrap
                ">
                  {faqAnswers[activeFaq as keyof typeof faqAnswers][language === 'uk' ? 'ua' : 'en']}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutHelp;