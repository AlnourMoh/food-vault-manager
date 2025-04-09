
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SetupLinkFormProps {
  email: string;
  setEmail: (email: string) => void;
  onGenerateLink: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SetupLinkForm = ({ email, setEmail, onGenerateLink, isLoading }: SetupLinkFormProps) => {
  const { toast } = useToast();

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "البريد الإلكتروني مطلوب",
        description: "يرجى إدخال البريد الإلكتروني للمطعم",
      });
      return;
    }

    onGenerateLink(e);
  };

  return (
    <form onSubmit={validateAndSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
        <Input 
          id="email" 
          type="email" 
          placeholder="أدخل البريد الإلكتروني" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <Button 
        type="submit" 
        className="bg-fvm-primary hover:bg-fvm-primary-light w-full"
        disabled={isLoading}
      >
        إنشاء رابط الإعداد
      </Button>
    </form>
  );
};

export default SetupLinkForm;
