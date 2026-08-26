import React from 'react';
import {
  X,
  BookOpen,
  Gamepad2,
  FileCode,
  Sparkles,
  ArrowRight,
  Monitor,
  CheckCircle2,
  Share2,
  Sun,
} from 'lucide-react';
import { RoomObjectInfo } from '../types';
import { playSound } from '../utils/audio';

interface ObjectDetailModalProps {
  objectInfo: RoomObjectInfo | null;
  onClose: () => void;
  onOpenComputer: () => void;
}

export const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({
  objectInfo,
  onClose,
  onOpenComputer,
}) => {
  if (!objectInfo || objectInfo.id === 'computer') return null;

  const getIcon = () => {
    switch (objectInfo.id) {
      case 'arcade':
        return Gamepad2;
      case 'whiteboard':
        return FileCode;
      case 'bookshelf':
        return BookOpen;
      case 'social_frames':
        return Share2;
      case 'window':
        return Sun;
      default:
        return Sparkles;
    }
  };

  const Icon = getIcon();

  const handleActionClick = () => {
    playSound('click');
    onOpenComputer();
  };

  return (
    <div
      id="object-detail-modal-card"
      className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl bg-slate-900/95 text-slate-100 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl animate-fadeIn"
    >
      {/* Top bar with Badge & Close */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {objectInfo.badge}
              </span>
              <span className="text-xs text-slate-400">{objectInfo.category}</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mt-0.5">
              {objectInfo.vietnameseName}
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('close');
            onClose();
          }}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Đóng & quay lại toàn cảnh phòng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="py-4 space-y-3">
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {objectInfo.details.description}
        </p>

        {objectInfo.details.highlights && (
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-400">Chi tiết nổi bật:</span>
            <ul className="space-y-1 text-xs text-slate-300">
              {objectInfo.details.highlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => {
            playSound('close');
            onClose();
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 cursor-pointer"
        >
          ← Quay lại toàn cảnh
        </button>

        <div className="flex items-center gap-2">
          {objectInfo.details.actions?.map((action, aIdx) => (
            <button
              key={aIdx}
              onClick={handleActionClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-black/40 transition-all cursor-pointer active:scale-95"
            >
              <span>{action.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ))}

          <button
            onClick={() => {
              playSound('open');
              onOpenComputer();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-black/40 transition-all cursor-pointer active:scale-95"
            title="Mở máy tính xem CV chi tiết"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Mở Máy Tính</span>
          </button>
        </div>
      </div>
    </div>
  );
};
