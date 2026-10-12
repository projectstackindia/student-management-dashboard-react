function ConfirmModal({ isOpen, onClose, onConfirm, studentName }) {
  if (!isOpen) return null;

  return (
    // Backdrop overlay ko pure dark custom translucent banaya
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      
      {/* Main Glassmorphic Container with High-End Border Gradient Effect */}
      <div className="bg-neutral-900/90 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 backdrop-blur-md animate-fadeIn text-left space-y-6">
        
        {/* Header with Tracking Wider Typography */}
        <div>
          <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase select-none drop-shadow-md">
            ⚠️ CONFIRM ACTION
          </h2>
        </div>
        
        {/* Content Body text layout formatted and bolded */}
        <div>
          <p className="text-white/60 text-sm font-bold tracking-wide leading-relaxed uppercase">
            ARE YOU ABSOLUTELY SURE YOU WANT TO TERMINATE PROFILE FOR 
            <span className="block my-2 text-base font-black text-white bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 tracking-widest truncate">
              {studentName}
            </span>
            THIS DELETION PROTOCOL CANNOT BE UNDONE IN THE SYSTEM DATABASE.
          </p>
        </div>
        
        {/* Action Controller Buttons aligned with Table actions style */}
        <div className="flex justify-end gap-4 pt-2">
          {/* CANCEL BUTTON */}
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-white/20 bg-white/5 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            CANCEL
          </button>
          
          {/* CONFIRM DELETE BUTTON */}
          <button
            onClick={onConfirm}
            className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            DELETE
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;