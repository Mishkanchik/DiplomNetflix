// наприклад: src/components/ConfirmDeleteModal.tsx
import React from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    userName,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            {/* Основний контейнер */}
            <div
                className="
          w-full max-w-md bg-gray-900/90 backdrop-blur-2xl rounded-3xl 
          border border-gray-800/60 shadow-2xl overflow-hidden
          transform transition-all duration-300 scale-100
        "
            >
                <div className="p-8 md:p-10">
                    {/* Заголовок — центрований, без кнопки закриття */}
                    <div className="flex items-center justify-center text-center mb-7">
                        <h2
                            className="
                text-3xl font-extrabold 
                bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 
                bg-clip-text text-transparent tracking-tight drop-shadow-lg
              "
                        >
                            Видалити користувача
                        </h2>
                    </div>

                    {/* Текст */}
                    <p className="text-center text-gray-300 mb-10 text-lg leading-relaxed">
                        Ви впевнені, що хочете <strong className="text-red-400 font-bold">назавжди</strong> видалити користувача{" "}
                        <strong className="text-white font-semibold">"{userName || "—"}"</strong>?
                        <br />
                        Цю дію не можна скасувати.
                    </p>

                    {/* Кнопки */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        {/* Скасувати */}
                        <button
                            onClick={onClose}
                            className="
                flex-1 py-4 px-8 rounded-2xl font-semibold text-lg text-gray-300
                border border-gray-700/80 hover:bg-gray-800/70 hover:text-white
                transition-all duration-300 ease-in-out
                shadow-md hover:shadow-lg hover:shadow-gray-900/50
                active:scale-[0.98]
              "
                        >
                            Скасувати
                        </button>

                        {/* Видалити */}
                        <button
                            onClick={onConfirm}
                            className="
                flex-1 py-4 px-8 rounded-2xl font-bold text-lg text-white
                bg-gradient-to-r from-red-600 via-rose-600 to-pink-600
                hover:from-red-500 hover:via-rose-500 hover:to-pink-500
                transition-all duration-300 ease-in-out transform
                shadow-xl shadow-gray-900/50 hover:shadow-2xl hover:shadow-gray-900/50
                active:scale-[0.98]
                relative overflow-hidden
              "
                        >
                            {/* Легкий блиск при наведенні */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;