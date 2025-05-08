
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Camera, Settings } from 'lucide-react';

interface PermissionErrorCardProps {
  onRequestPermission: () => Promise<void>;
  onOpenSettings: () => Promise<void>;
  isRequestingPermission: boolean;
}

export const PermissionErrorCard: React.FC<PermissionErrorCardProps> = ({
  onRequestPermission,
  onOpenSettings,
  isRequestingPermission
}) => {
  return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="pt-6">
        <Alert className="bg-transparent border-none">
          <Camera className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-600">لم يتم منح إذن الكاميرا</AlertTitle>
          <AlertDescription>
            يحتاج التطبيق إلى إذن الوصول للكاميرا لمسح الباركود. الرجاء منح التصريح اللازم.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-2 mt-4">
          <Button 
            onClick={onRequestPermission}
            className="w-full"
            variant="default"
            disabled={isRequestingPermission}
          >
            <Camera className="h-4 w-4 ml-2" />
            {isRequestingPermission ? 'جاري طلب الإذن...' : 'طلب إذن الكاميرا'}
          </Button>
          
          <Button 
            onClick={onOpenSettings}
            className="w-full"
            variant="secondary"
          >
            <Settings className="h-4 w-4 ml-2" />
            فتح إعدادات التطبيق
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
