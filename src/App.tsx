import React, { useState } from 'react';
import { ThreeRoom } from './components/ThreeRoom';
import { ComputerOS } from './components/ComputerOS';
import { CVEditorModal } from './components/CVEditorModal';
import { RoomObjectId, CVData } from './types';
import { DEFAULT_CV_DATA } from './data/cvData';

const STORAGE_KEY = 'DEV_ROOM_CV_DATA_V2';

export default function App() {
  const [selectedObjectId, setSelectedObjectId] = useState<RoomObjectId | null>(null);
  const [isComputerOpen, setIsComputerOpen] = useState(false);
  const [isCVEditorOpen, setIsCVEditorOpen] = useState(false);

  // CV data with localStorage cache
  const [cvData, setCvData] = useState<CVData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_CV_DATA;
  });

  const handleSaveCVData = (newData: CVData) => {
    setCvData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // ignore
    }
  };

  const handleSelectObject = (id: RoomObjectId) => {
    setSelectedObjectId(id);
    if (id === 'computer') {
      setTimeout(() => {
        setIsComputerOpen(true);
      }, 300);
    } else {
      setIsComputerOpen(false);
    }
  };

  const handleResetView = () => {
    setSelectedObjectId(null);
    setIsComputerOpen(false);
  };

  const handleOpenComputerDirect = () => {
    setSelectedObjectId('computer');
    setIsComputerOpen(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* 1. 3D Isometric Room Canvas - Static & Standing Still */}
      <ThreeRoom
        selectedObjectId={selectedObjectId}
        onSelectObject={handleSelectObject}
        onResetView={handleResetView}
      />

      {/* 2. Full-Screen Anime Desktop OS with Yellow Back Button */}
      {isComputerOpen && (
        <ComputerOS
          cvData={cvData}
          onOpenCVEditor={() => setIsCVEditorOpen(true)}
          onBackToRoom={handleResetView}
        />
      )}

      {/* 3. Live CV Editor Modal */}
      <CVEditorModal
        isOpen={isCVEditorOpen}
        cvData={cvData}
        onSave={handleSaveCVData}
        onClose={() => setIsCVEditorOpen(false)}
      />
    </main>
  );
}
