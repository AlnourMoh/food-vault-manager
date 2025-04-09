
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface SetupLinkDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  setupLink: string;
}

const SetupLinkDialog = ({ showDialog, setShowDialog, setupLink }: SetupLinkDialogProps) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(setupLink);
    toast({
      title: "تم نسخ الرابط",
      description: "يمكنك مشاركة الرابط مع مدير المطعم",
    });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="rtl">
        <DialogHeader>
          <DialogTitle>رابط إعداد حساب المطعم</DialogTitle>
          <DialogDescription>
            شارك هذا الرابط مع مدير المطعم ليتمكن من إعداد كلمة المرور الخاصة به
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 p-3 rounded-md break-all text-sm">
          {setupLink}
        </div>
        <DialogFooter>
          <Button 
            className="bg-fvm-primary hover:bg-fvm-primary-light w-full flex items-center gap-2 justify-center" 
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
            <span>نسخ الرابط</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetupLinkDialog;
