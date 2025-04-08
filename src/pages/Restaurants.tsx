
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define restaurant interface
interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  isActive?: boolean; // This will be managed on the frontend
  manager?: string; // This will be placeholder for now
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our restaurant interface
      const formattedRestaurants = data.map((restaurant: any) => ({
        ...restaurant,
        isActive: true, // Assume all fetched restaurants are active for now
        manager: "مدير المطعم", // Placeholder for now
        registrationDate: restaurant.created_at
      }));

      setRestaurants(formattedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast({
        variant: "destructive",
        title: "خطأ في جلب بيانات المطاعم",
        description: "حدث خطأ أثناء محاولة جلب بيانات المطاعم. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">المطاعم</h1>
          <Button 
            className="bg-fvm-primary hover:bg-fvm-primary-light flex items-center gap-2"
            onClick={() => navigate('/restaurants/add')}
          >
            <Plus className="h-4 w-4" />
            <span>إضافة مطعم جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">قائمة المطاعم</CardTitle>
            <CardDescription>قائمة بجميع المطاعم المسجلة في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-fvm-primary"></div>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                لا توجد مطاعم مسجلة بعد. قم بإضافة مطعم جديد.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المطعم</TableHead>
                    <TableHead className="text-right">المدير</TableHead>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">رقم الهاتف</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.manager || "غير محدد"}</TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>{restaurant.phone}</TableCell>
                      <TableCell>{restaurant.email}</TableCell>
                      <TableCell>
                        {new Date(restaurant.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          نشط
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/restaurants/${restaurant.id}/credentials`)}
                          className="flex items-center gap-1"
                        >
                          <Key className="h-4 w-4" />
                          <span>بيانات الدخول</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Restaurants;
