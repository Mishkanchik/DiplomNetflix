import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscription {
    plan: 'basic' | 'standard' | 'premium';
    status: 'active' | 'cancelled' | 'expired';
    price: number;
    billingCycle: string;
    nextBillingDate: string;
    startDate: string;
}

const getPlanFeatures = (t: (key: string) => string, plan: Subscription['plan']) => {
    switch (plan) {
        case 'basic':
            return [
                t('subscription.basic_access'),
                t('subscription.basic_access_desc'),
                t('subscription.basic_recommendations'),
                t('subscription.basic_no_features'),
            ];
        case 'standard':
            return [
                t('subscription.standard_all_basic'),
                t('subscription.standard_full_hd'),
                t('subscription.standard_no_ads'),
                t('subscription.standard_offline'),
                t('subscription.standard_devices'),
                t('subscription.standard_parental'),
            ];
        case 'premium':
            return [
                t('subscription.premium_all_standard'),
                t('subscription.premium_4k'),
                t('subscription.premium_devices'),
                t('subscription.premium_exclusive'),
            ];
        default:
            return [];
    }
};

const PLAN_PRICES: Record<Subscription['plan'], number> = {
    basic: 0,
    standard: 199,
    premium: 299,
};

const SubscriptionManagement = () => {
    const { t } = useLanguage();
    const [subscription, setSubscription] = useState<Subscription>(() => {
        // Initialize from localStorage if available
        const raw = localStorage.getItem('userPlan');
        const plan = raw === 'basic' || raw === 'standard' || raw === 'premium' ? raw : 'standard';
        return {
            plan,
            status: 'active',
            price: PLAN_PRICES[plan],
            billingCycle: 'month',
            nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            startDate: new Date().toISOString().split('T')[0],
        };
    });

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const confirmBtnRef = useRef<HTMLButtonElement | null>(null);
    const [showChangePlanModal, setShowChangePlanModal] = useState(false);

    const handleCancelSubscription = async () => {
        setCancelling(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubscription(prev => {
                const updated: Subscription = { ...prev, status: 'cancelled' };
                localStorage.setItem('userPlan', updated.plan);
                // Dispatch custom event for sync
                window.dispatchEvent(new Event('userPlanChanged'));
                return updated;
            });
            setShowCancelModal(false);
            toast.success(t('subscriptionManagement.subscriptionCancelled'));
        } catch (error) {
            toast.error('Error cancelling subscription');
        } finally {
            setCancelling(false);
        }
    };

    const handleRestoreSubscription = async () => {
        try {
            // simulate API call
            await new Promise((r) => setTimeout(r, 800));
            setSubscription((prev) => {
                const updated: Subscription = { ...prev, status: 'active' };
                localStorage.setItem('userPlan', updated.plan);
                window.dispatchEvent(new Event('userPlanChanged'));
                return updated;
            });
            toast.success(t('subscriptionManagement.subscriptionRestored') || 'Subscription restored');
        } catch (err) {
            toast.error('Error restoring subscription');
        }
    };
    useEffect(() => {
        if (showCancelModal || showChangePlanModal) {
            // scroll modal into view and focus confirm (no full-page lock)
            setTimeout(() => {
                modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                confirmBtnRef.current?.focus();
            }, 50);
        }
    }, [showCancelModal, showChangePlanModal]);

    const handleChangePlan = async (plan: Subscription['plan']) => {
        try {
            // simulate API call
            await new Promise((r) => setTimeout(r, 800));
            const newPrice = PLAN_PRICES[plan];
            setSubscription((prev) => {
                const updated = {
                    ...prev,
                    plan,
                    price: newPrice,
                    nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                };
                localStorage.setItem('userPlan', plan);
                window.dispatchEvent(new Event('userPlanChanged'));
                return updated;
            });
            setShowChangePlanModal(false);
            toast.success(t('subscriptionManagement.planChanged') || 'Plan changed');
        } catch (err) {
            toast.error('Error changing plan');
        }
    };

    const getPlanName = (plan?: Subscription['plan']) => {
        const p = plan || subscription.plan;
        switch (p) {
            case 'basic':
                return t('subscription.basic');
            case 'standard':
                return t('subscription.standard');
            case 'premium':
                return t('subscription.premium');
            default:
                return '';
        }
    };

    const getStatusColor = () => {
        switch (subscription.status) {
            case 'active':
                return 'text-green-400';
            case 'cancelled':
                return 'text-red-400';
            case 'expired':
                return 'text-yellow-400';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusBgColor = () => {
        switch (subscription.status) {
            case 'active':
                return 'bg-green-900/20 border-green-700/50';
            case 'cancelled':
                return 'bg-red-900/20 border-red-700/50';
            case 'expired':
                return 'bg-yellow-900/20 border-yellow-700/50';
            default:
                return 'bg-gray-900/20 border-gray-700/50';
        }
    };

    // ...existing code...
    const getPlanPrice = (plan: Subscription['plan']) => PLAN_PRICES[plan];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {t('subscriptionManagement.title')}
                </h2>
                <p className="text-gray-400">{t('subscription.title')}</p>
            </div>

            {/* Subscription Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Plan Details */}
                    <div>
                        <div className="flex items-start gap-3 mb-6">
                            <Zap className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">{t('subscription.title')}</p>
                                <h3 className="text-3xl font-bold text-white">{getPlanName()}</h3>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6 ${getStatusBgColor()}`}>
                            {subscription.status === 'active' ? (
                                <>
                                    <CheckCircle className={`w-4 h-4 ${getStatusColor()}`} />
                                    <span className={`font-medium ${getStatusColor()}`}>
                                        {t('subscription.active') || 'Активна'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className={`w-4 h-4 ${getStatusColor()}`} />
                                    <span className={`font-medium ${getStatusColor()}`}>
                                        {t('subscriptionManagement.subscriptionCancelled')}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Plan Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t('subscription.cost') || 'Вартість:'}</span>
                                <span className="text-white font-medium">{subscription.price} грн/міс</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">{t('subscription.start_date') || 'Дата початку:'}</span>
                                <span className="text-white font-medium">{subscription.startDate}</span>
                            </div>
                            {subscription.status === 'active' && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">{t('subscription.next_billing') || 'Наступне списання:'}</span>
                                    <span className="text-white font-medium">{subscription.nextBillingDate}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Features & Actions */}
                    <div className="flex flex-col justify-between">
                        {/* Features Summary */}
                        <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                            <p className="text-xs text-gray-400 mb-3 font-semibold uppercase">{t('subscription.included_features') || 'Включено в плані:'}</p>
                            <ul className="space-y-2 text-sm">
                                {getPlanFeatures(t, subscription.plan).map((feature, idx) => (
                                    <li key={idx} className="text-gray-300">✓ {feature}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {subscription.status === 'active' && (
                                <>
                                    <button onClick={() => setShowChangePlanModal(true)} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200">
                                        {t('subscriptionManagement.changePlan') || 'Змінити план'}
                                    </button>
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-lg border border-red-600/50 transition-all duration-200"
                                    >
                                        {t('subscriptionManagement.cancelSubscription')}
                                    </button>
                                </>
                            )}
                            {subscription.status === 'cancelled' && (
                                <button onClick={handleRestoreSubscription} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200">
                                    {t('subscriptionManagement.restoreSubscription') || 'Відновити підписку'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal (inline) */}
            {showCancelModal && (
                <div ref={modalRef} className="mt-6 mb-8 bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white">{t('subscriptionManagement.cancelConfirmTitle') || 'Скасувати підписку?'}</h3>
                    </div>
                    <p className="text-gray-400 mb-6">{t('subscriptionManagement.cancelConfirmDesc') || 'Ви впевнені? Після скасування ви втратите доступ до преміум функцій наприкінці поточного періоду.'}</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200" disabled={cancelling}>
                            {t('subscriptionManagement.cancelKeep') || 'Ні, залишитись'}
                        </button>
                        <button ref={confirmBtnRef} onClick={handleCancelSubscription} disabled={cancelling} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition-colors duration-200">
                            {cancelling ? (t('subscriptionManagement.cancelling') || 'Скасовуємо...') : (t('subscriptionManagement.confirmCancel') || 'Так, скасувати')}
                        </button>
                    </div>
                </div>
            )}

            {/* Change Plan Modal (inline) */}
            {showChangePlanModal && (
                <div ref={modalRef} className="mt-6 mb-8 bg-gray-900 rounded-2xl border border-gray-700 p-6 pr-12 max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{t('subscriptionManagement.changePlanTitle') || 'Оберіть план'}</h3>
                        <button onClick={() => setShowChangePlanModal(false)} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['basic', 'standard', 'premium'] as Subscription['plan'][]).map(plan => (
                            <div key={plan} className={`p-4 pr-6 md:pr-8 rounded-lg border ${plan === 'standard' ? 'border-indigo-600/50 bg-gradient-to-b from-indigo-900/10 to-transparent' : 'border-gray-700 bg-gray-900/40'} text-center`}>
                                <h4 className="font-bold">{getPlanName(plan)}</h4>
                                <p className="text-white font-black text-2xl">{getPlanPrice(plan)} грн</p>
                                <ul className="space-y-1 text-xs text-gray-300 mt-2 mb-3 text-left">
                                    {getPlanFeatures(t, plan).map((feature, idx) => (
                                        <li key={idx}>✓ {feature}</li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleChangePlan(plan)}
                                    disabled={subscription.plan === plan}
                                    className={`mt-2 w-full px-3 py-2 rounded-md text-white ${subscription.plan === plan ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {subscription.plan === plan ? t('subscriptionManagement.currentPlan') || 'Поточний план' : t('subscriptionManagement.choosePlan') || 'Обрати'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManagement;