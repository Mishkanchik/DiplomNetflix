// наприклад: src/components/ConfirmBlockModal.tsx
import React from "react";


interface ConfirmBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    isBlocking: boolean; // true = заблокувати, false = розблокувати
}

const ConfirmBlockModal: React.FC<ConfirmBlockModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    userName,
    isBlocking,
}) => {
    if (!isOpen) return null;

    const gradientFrom = isBlocking ? "from-red-600" : "from-emerald-600";
    const gradientTo = isBlocking ? "to-rose-600" : "to-teal-600";
    const hoverFrom = isBlocking ? "from-red-500" : "from-emerald-500";
    const hoverTo = isBlocking ? "to-rose-500" : "to-teal-500";
    const shadowColor = isBlocking ? "red-900/50" : "emerald-900/40";

    const title = isBlocking ? "Заблокувати користувача" : "Розблокувати користувача";
    const actionText = isBlocking ? "Заблокувати" : "Розблокувати";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            {/* Основний контейнер */}
            <div
                className={`
          w-full max-w-md bg-gray-900/90 backdrop-blur-2xl rounded-3xl 
          border border-gray-800/60 shadow-2xl overflow-hidden
          transform transition-all duration-300 scale-100
          hover:shadow-${shadowColor}
        `}
            >
                <div className="p-8 md:p-10">
                    {/* Заголовок + закриття */}
                    <div className="flex items-center  text-center  mb-7">
                        <h2
                            className={`
                text-3xl font-extrabold bg-gradient-to-r ${isBlocking
                                    ? "from-red-400 via-rose-500 to-pink-500"
                                    : "from-emerald-400 via-teal-500 to-cyan-500"} 
                bg-clip-text text-transparent tracking-tight drop-shadow-lg
              `}
                        >
                            {title}
                        </h2>


                    </div>

                    {/* Текст */}
                    <p className="text-center text-gray-300 mb-10 text-lg leading-relaxed">
                        Ви впевнені, що хочете <strong className="text-white font-semibold">"{userName || "—"}"</strong>{" "}
                        {isBlocking ? "заблокувати" : "розблокувати"}?
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

                        {/* Підтвердити */}
                        <button
                            onClick={onConfirm}
                            className={`
                flex-1 py-4 px-8 rounded-2xl font-bold text-lg text-white
                bg-gradient-to-r ${gradientFrom} ${gradientTo}
                hover:${hoverFrom} hover:${hoverTo}
                transition-all duration-300 ease-in-out transform
                shadow-xl shadow-${shadowColor} hover:shadow-2xl hover:shadow-${shadowColor}
                active:scale-[0.98]
                relative overflow-hidden
              `}
                        >
                            {/* Легкий блиск при наведенні */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            {actionText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBlockModal;