import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl transform transition-all animate-fade-in">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-4 justify-end">
          <button onClick={onCancel} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
