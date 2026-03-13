// src/pages/TermsOfService.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from '../../contexts/LanguageContext';
import { User, ShieldCheck, Film, AlertTriangle, RefreshCcw, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-2 py-10">
            <div className="max-w-3xl w-full mx-auto shadow-2xl rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl p-0 md:p-0 overflow-hidden">
                {/* Header */}
                <div className="relative text-center py-12 px-6 md:px-12 bg-gradient-to-r from-cyan-900 via-purple-900 to-pink-900">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                        {t('terms.title')}
                    </h1>
                    <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                        {t('terms.last_update')}
                    </p>
                </div>

                {/* Intro */}
                <section className="px-6 md:px-12 py-8 md:py-10 bg-gray-950/80 border-b border-gray-800">
                    <p className="text-lg leading-relaxed text-gray-300">
                        {t('terms.intro1')}
                    </p>
                    <p className="mt-4 text-lg leading-relaxed text-gray-300">
                        {t('terms.intro2')}
                    </p>
                </section>

                {/* Sections */}
                <div className="space-y-10 px-6 md:px-12 py-8 md:py-10">
                    {/* 1. Registration & Account */}
                    <section className="rounded-2xl bg-gradient-to-r from-cyan-900/30 to-cyan-800/10 p-6 border border-cyan-700/30 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-7 h-7 text-cyan-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">
                                {t('terms.section1.title')}
                            </h2>
                        </div>
                        <ul className="space-y-3 text-gray-300 text-base leading-relaxed ml-6 list-disc">
                            <li>{t('terms.section1.item1')}</li>
                            <li>{t('terms.section1.item2')}</li>
                            <li>{t('terms.section1.item3')}</li>
                            <li>{t('terms.section1.item4')}</li>
                        </ul>
                    </section>

                    {/* 2. Service Usage Rules */}
                    <section className="rounded-2xl bg-gradient-to-r from-purple-900/30 to-purple-800/10 p-6 border border-purple-700/30 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="w-7 h-7 text-purple-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-purple-300">
                                {t('terms.section2.title')}
                            </h2>
                        </div>
                        <ul className="space-y-3 text-gray-300 text-base leading-relaxed ml-6 list-disc">
                            <li>{t('terms.section2.item1')}</li>
                            <li>{t('terms.section2.item2')}</li>
                            <li>{t('terms.section2.item3')}</li>
                            <li>{t('terms.section2.item4')}</li>
                        </ul>
                    </section>

                    {/* 3. Intellectual Property */}
                    <section className="rounded-2xl bg-gradient-to-r from-pink-900/30 to-pink-800/10 p-6 border border-pink-700/30 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <Film className="w-7 h-7 text-pink-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-pink-300">
                                {t('terms.section3.title')}
                            </h2>
                        </div>
                        <p className="text-base leading-relaxed text-gray-300">
                            {t('terms.section3.desc')}
                        </p>
                    </section>

                    {/* 4. Limitation of Liability */}
                    <section className="rounded-2xl bg-gradient-to-r from-cyan-900/20 to-cyan-800/5 p-6 border border-cyan-700/20 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-7 h-7 text-cyan-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">
                                {t('terms.section4.title')}
                            </h2>
                        </div>
                        <ul className="space-y-3 text-gray-300 text-base leading-relaxed ml-6 list-disc">
                            <li>{t('terms.section4.item1')}</li>
                            <li>{t('terms.section4.item2')}</li>
                            <li>{t('terms.section4.item3')}</li>
                        </ul>
                    </section>

                    {/* 5. Changes to Terms */}
                    <section className="rounded-2xl bg-gradient-to-r from-purple-900/20 to-purple-800/5 p-6 border border-purple-700/20 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <RefreshCcw className="w-7 h-7 text-purple-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-purple-300">
                                {t('terms.section5.title')}
                            </h2>
                        </div>
                        <p className="text-base leading-relaxed text-gray-300">
                            {t('terms.section5.desc')}
                        </p>
                    </section>

                    {/* 6. Contact Us */}
                    <section className="rounded-2xl bg-gradient-to-r from-pink-900/20 to-pink-800/5 p-6 border border-pink-700/20 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <Mail className="w-7 h-7 text-pink-400" />
                            <h2 className="text-2xl md:text-3xl font-bold text-pink-300">
                                {t('terms.section6.title')}
                            </h2>
                        </div>
                        <p className="text-base leading-relaxed text-gray-300">
                            {t('terms.section6.desc')} {" "}
                            <a
                                href="mailto:support@nexocinema.com"
                                className="text-cyan-400 hover:text-cyan-300 underline transition duration-150"
                            >
                                support@nexocinema.com
                            </a>
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <div className="w-full py-8 px-6 md:px-12 bg-gray-950/80 border-t border-gray-800 text-center">
                    <p className="text-lg text-gray-300">
                        {t('terms.footer')}
                    </p>
                    <p className="mt-4">
                        <Link to="/" className="text-cyan-400 hover:text-cyan-300 underline transition duration-150 font-semibold">
                            {t('terms.back_home')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;