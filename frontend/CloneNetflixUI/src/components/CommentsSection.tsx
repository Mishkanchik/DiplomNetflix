import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MessageCircle, UserCircle2, Edit2, Trash2 } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  currentUser?: string;
  onAddComment?: (comment: Comment) => void;
  onEditComment?: (comment: Comment) => void;
  onDeleteComment?: (id: number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, currentUser, onAddComment, onEditComment, onDeleteComment }) => {
  const { t, language } = useLanguage();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAddComment = () => {
    if (!text.trim()) {
      setError(t('comments.error_empty'));
      return;
    }
    let author = currentUser || guestName.trim() || t('comments.unknown_user');
    if (!currentUser && !guestName.trim()) {
      setError(t('comments.error_name'));
      return;
    }
    // Зберігаємо guestName у localStorage для ідентифікації гостя
    if (!currentUser && guestName.trim()) {
      localStorage.setItem('guestName', guestName.trim());
    }
    const newComment: Comment = {
      id: Date.now(),
      author,
      date: new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      text,
    };
    setText('');
    setGuestName('');
    setError('');
    onAddComment && onAddComment(newComment);
  };

  return (
    <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-800 max-w-2xl mx-auto mt-10 shadow-2xl">
      <h3 className="text-3xl font-black mb-6 text-white tracking-tight drop-shadow-lg">{t('comments.title')}</h3>
      <div className="space-y-6 mb-8">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-lg italic">{t('comments.empty')}</p>
        ) : (
          comments.map((c) => {
            // Власник: авторизований користувач або гість, ім'я якого збережено у localStorage
            const guestLocal = localStorage.getItem('guestName');
            const isOwner = (currentUser && c.author === currentUser) || (!currentUser && guestLocal && c.author === guestLocal);
            return (
              <div key={c.id} className="bg-gradient-to-r from-indigo-900/40 to-gray-900/60 rounded-2xl p-5 border border-gray-700 shadow-md flex gap-4 items-start animate-fade-in">
                <div className="flex-shrink-0">
                  <UserCircle2 className="w-10 h-10 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-indigo-300 text-lg">{c.author}</span>
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </div>
                  {editingId === c.id ? (
                    <>
                      <textarea
                        className="w-full p-3 rounded-xl bg-gray-800 text-white border border-indigo-700 focus:outline-none focus:border-indigo-500 resize-none mb-2 text-base"
                        rows={3}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors duration-200 text-base"
                          onClick={() => {
                            if (editText.trim() && onEditComment) {
                              onEditComment({ ...c, text: editText });
                              setEditingId(null);
                            }
                          }}
                        >{t('comments.save_button') || 'Зберегти'}</button>
                        <button
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-gray-200 rounded-xl transition-colors duration-200 text-base"
                          onClick={() => { setEditingId(null); setEditText(''); }}
                        >{t('comments.cancel_button') || 'Скасувати'}</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-100 text-base whitespace-pre-line leading-relaxed">
                      {c.text}
                    </div>
                  )}
                </div>
                {isOwner && editingId !== c.id && (
                  <div className="flex gap-2 ml-2 items-center">
                    <button
                      className="p-2 rounded-full hover:bg-indigo-700 transition-colors duration-150 group"
                      onClick={() => { setEditingId(c.id); setEditText(c.text); }}
                      title={t('comments.edit_button') || 'Редагувати'}
                    >
                      <Edit2 className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-700 transition-colors duration-150 group"
                      onClick={() => setDeleteId(c.id)}
                      title={t('comments.delete_button') || 'Видалити'}
                    >
                      <Trash2 className="w-5 h-5 text-red-400 group-hover:text-white" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-4">
        {!showInput ? (
          <button
            className="flex items-center gap-2 px-5 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl transition-colors duration-200 shadow-lg text-lg"
            onClick={() => setShowInput(true)}
          >
            <MessageCircle className="w-6 h-6" />
            {t('comments.write_button') || 'Написати коментар'}
          </button>
        ) : (
          <>
            {!currentUser && (
              <input
                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-indigo-700 focus:outline-none focus:border-indigo-500 mb-3 text-lg"
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder={t('comments.name_placeholder') || 'Ваше ім’я'}
              />
            )}
            <textarea
              className="w-full p-4 rounded-xl bg-gray-800 text-white border border-indigo-700 focus:outline-none focus:border-indigo-500 resize-none mb-3 text-lg"
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={t('comments.placeholder')}
            />
            {error && <div className="text-red-400 mb-2 text-base font-semibold">{error}</div>}
            <div className="flex gap-3">
              <button
                className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors duration-200 text-lg"
                onClick={handleAddComment}
              >
                {t('comments.add_button')}
              </button>
              <button
                className="px-5 py-3 bg-gray-700 hover:bg-gray-800 text-gray-200 rounded-xl transition-colors duration-200 text-lg"
                onClick={() => { setShowInput(false); setText(''); setError(''); setGuestName(''); }}
              >
                {t('comments.cancel_button') || 'Скасувати'}
              </button>
            </div>
          </>
        )}
      </div>
      {/* Modal for delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl max-w-sm w-full text-center animate-fade-in">
            <h4 className="text-xl font-bold text-white mb-4">{t('comments.delete_confirm_title') || 'Видалити коментар?'}</h4>
            <p className="text-gray-300 mb-6">{t('comments.delete_confirm_desc') || 'Ви дійсно хочете видалити цей коментар? Цю дію не можна скасувати.'}</p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-gray-200 rounded-xl font-semibold transition-colors duration-150"
                onClick={() => setDeleteId(null)}
              >{t('comments.cancel_button') || 'Скасувати'}</button>
              <button
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors duration-150"
                onClick={() => {
                  onDeleteComment && onDeleteComment(deleteId);
                  setDeleteId(null);
                }}
              >{t('comments.delete_button') || 'Видалити'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
