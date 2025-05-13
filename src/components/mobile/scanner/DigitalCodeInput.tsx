
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save } from 'lucide-react';

interface DigitalCodeInputProps {
  onSubmit: (code: string) => void;
  onCancel: () => void;
}

export const DigitalCodeInput: React.FC<DigitalCodeInputProps> = ({
  onSubmit,
  onCancel
}) => {
  const [code, setCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.trim() === '') return;
    
    try {
      setIsSubmitting(true);
      onSubmit(code.trim());
    } catch (error) {
      console.error('خطأ في إرسال الكود:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">إدخال الباركود يدويًا</h2>
        
        <p className="text-gray-600 text-sm mb-6 text-center">
          يرجى إدخال الباركود المطبوع على المنتج أو من مستندات المنتج.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="barcode" className="text-sm font-medium block mb-1">
              رمز الباركود:
            </label>
            <Input
              id="barcode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: 123456789012"
              className="w-full text-lg tracking-wider"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={20}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={!code || isSubmitting || code.trim() === ''}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  تأكيد الإدخال
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
            >
              <X className="mr-2 h-4 w-4" />
              إلغاء
            </Button>
          </div>
        </form>
        
        <div className="mt-4 p-3 bg-amber-50 rounded-md">
          <p className="text-amber-800 text-xs">
            <strong>ملاحظة:</strong> تأكد من إدخال جميع الأرقام الظاهرة على الباركود، 
            عادة ما تكون 8-13 رقماً بدون مسافات أو رموز خاصة.
          </p>
        </div>
      </div>
    </div>
  );
};
