'use client';

import { useState, useEffect } from 'react';
import { SimpleProgrammeModal } from '@/components/ui/simple-programme-modal';
// import { Programme } from '@/types/common';

interface ProgrammeModalWrapperProps {
  programme: any; // Type temporaire pour éviter les conflits
}

export function ProgrammeModalWrapper({ programme }: ProgrammeModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Attendre un peu avant de naviguer pour permettre l'animation de fermeture
    setTimeout(() => {
      window.history.back();
    }, 150);
  };

  return (
    <SimpleProgrammeModal
      programme={programme}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}
