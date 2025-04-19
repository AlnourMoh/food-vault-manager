
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Keyboard, Check, X } from 'lucide-react';

interface DigitalCodeInputProps {
  onSubmit: (code: string) => void;
  onCancel: () => void;
}

export const DigitalCodeInput = ({ onSubmit, onCancel }: DigitalCodeInputProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('يرجى إدخال الكود');
      return;
    }
    
    // Basic validation - codes are usually alphanumeric
    if (!/^[A-Za-z0-9-]+$/.test(code)) {
      setError('الكود يجب أن يحتوي على أحرف وأرقام فقط');
      return;
    }
    
    setError(null);
    onSubmit(code.trim());
  };

  return (
    <Card className="p-4 fixed inset-x-0 bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="flex flex-col items-center justify-center py-6 space-y-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full w-16 h-16 flex items-center justify-center">
          <Keyboard className="h-8 w-8" />
        </div>
        
        <h3 className="text-xl font-bold">إدخال الكود يدويًا</h3>
        
        <p className="text-center text-muted-foreground">
          يرجى إدخال الكود الموجود على المنتج
        </p>
        
        <div className="w-full space-y-2">
          <Input
            placeholder="أدخل الكود هنا"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            className="text-center text-lg"
            autoFocus
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>
        
        <div className="flex flex-col w-full space-y-2 mt-4">
          <Button 
            onClick={handleSubmit}
            className="w-full"
            variant="default"
          >
            <Check className="h-4 w-4 ml-2" />
            تأكيد
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
        </div>
      </div>
    </Card>
  );
};
