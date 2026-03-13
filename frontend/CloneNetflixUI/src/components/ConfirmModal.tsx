// src/components/ConfirmModal.tsx
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      {/* Основний контейнер модалки */}
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-gray-800/60 shadow-2xl shadow-indigo-950/50 overflow-hidden transform transition-all duration-300 scale-100 hover:shadow-indigo-900/40">
        <div className="p-10">
          {/* Заголовок */}
          <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            {title}
          </h2>

          {/* Опис */}
          <p className="text-center text-gray-300 mb-10 text-base leading-relaxed">
            {description}
          </p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Скасувати */}
            <button
              onClick={onClose}
              className="
                flex-1 py-4 px-6 rounded-2xl font-semibold text-lg text-gray-300
                border border-gray-700/80 hover:bg-gray-800/70 hover:text-white
                transition-all duration-300 ease-in-out
                shadow-md hover:shadow-lg hover:shadow-gray-900/50
                active:scale-[0.98]
              "
            >
              {cancelText}
            </button>

            {/* Підтвердити (червоний градієнт) */}
            <button
              onClick={onConfirm}
              className="
                flex-1 py-4 px-6 rounded-2xl font-semibold text-lg text-white
                bg-gradient-to-r from-red-600 via-rose-600 to-pink-600
                hover:from-red-500 hover:via-rose-500 hover:to-pink-500
                transition-all duration-300 ease-in-out transform
                shadow-xl shadow-red-900/50 hover:shadow-2xl hover:shadow-red-900/60
                active:scale-[0.98]
                relative overflow-hidden
              "
            >
              {/* Легкий градієнтний ефект при наведенні */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;