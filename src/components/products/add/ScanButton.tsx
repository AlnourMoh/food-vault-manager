import React from 'react';
import { Button } from '@/components/ui/button';
import { ScanIcon, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScanButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  onClick?: () => Promise<void>;
  isLoading?: boolean;
  loadingText?: string;
}

const ScanButton: React.FC<ScanButtonProps> = ({ 
  className = "", 
  variant = "default",
  disabled = false,
  onClick,
  isLoading = false,
  loadingText = "جاري التحميل..."
}) => {
  const navigate = useNavigate();
  
  const handleScan = () => {
    if (onClick) {
      // If onClick prop is provided, use it
      onClick();
    } else {
      // Otherwise, navigate directly to the scan page
      navigate('/scan');
    }
  };
  
  return (
    <Button 
      onClick={handleScan} 
      className={`${className} ${isLoading ? "gap-2" : ""}`}
      variant={variant}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Camera className="h-4 w-4" /> : <ScanIcon className="mr-2 h-4 w-4" />}
      {isLoading ? loadingText : "مسح الباركود"}
    </Button>
  );
};

export default ScanButton;
