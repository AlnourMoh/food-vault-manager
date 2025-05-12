
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScanButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

const ScanButton: React.FC<ScanButtonProps> = ({ 
  className = "", 
  variant = "default",
  disabled = false
}) => {
  const navigate = useNavigate();
  
  const handleScan = () => {
    // Navigate directly to the scan page
    navigate('/scan');
  };
  
  return (
    <Button 
      onClick={handleScan} 
      className={className}
      variant={variant}
      disabled={disabled}
    >
      <ScanIcon className="mr-2 h-4 w-4" />
      مسح الباركود
    </Button>
  );
};

export default ScanButton;
