
import React, { useState, useEffect } from 'react';

export const useDialogState = (open: boolean, onResetErrors: () => void) => {
  const [formDirty, setFormDirty] = useState(false);

  // Reset form state and validation errors when dialog closes
  useEffect(() => {
    if (!open) {
      setFormDirty(false);
      onResetErrors();
    }
  }, [open, onResetErrors]);

  const handleSuccess = () => {
    setFormDirty(false);
  };

  const handleAddAnother = () => {
    setFormDirty(true);
    onResetErrors();
  };

  return {
    formDirty,
    handleSuccess,
    handleAddAnother
  };
};
