
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRestaurantLogin } from '@/hooks/useRestaurantLogin';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading } = useRestaurantLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
        <Input 
          id="email" 
          type="email" 
          placeholder="البريد الإلكتروني" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
        <Input 
          id="password" 
          type="password" 
          placeholder="كلمة المرور" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-fvm-primary hover:bg-fvm-primary-light text-white"
        disabled={isLoading}
      >
        {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
};
