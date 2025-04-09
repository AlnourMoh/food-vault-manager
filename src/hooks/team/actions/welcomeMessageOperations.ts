
import { useToast } from '@/hooks/use-toast';
import { TeamMemberFormData } from '@/types/team';
import { generateWelcomeMessage, copyToClipboard } from '@/utils/welcomeMessageUtils';

/**
 * Hook for welcome message operations
 */
export const useWelcomeMessageOperations = () => {
  const { toast } = useToast();

  /**
   * Copy welcome message to clipboard
   */
  const copyWelcomeMessage = async (memberData: TeamMemberFormData | null) => {
    if (!memberData) return;
    
    const message = generateWelcomeMessage(memberData);
    const success = await copyToClipboard(message);
    
    if (success) {
      toast({
        title: 'تم نسخ الرسالة',
        description: 'تم نسخ رسالة الترحيب إلى الحافظة',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'فشل نسخ الرسالة',
        description: 'حدث خطأ أثناء محاولة نسخ الرسالة',
      });
    }
  };

  return { copyWelcomeMessage };
};
