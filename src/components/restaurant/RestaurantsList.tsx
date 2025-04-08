
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Key, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/types';
import RestaurantDeleteDialog from './RestaurantDeleteDialog';

interface RestaurantsListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  onRestaurantDeleted: () => void;
}

const RestaurantsList: React.FC<RestaurantsListProps> = ({ 
  restaurants, 
  isLoading, 
  onRestaurantDeleted 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const navigate = useNavigate();

  const handleEditRestaurant = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}/edit`);
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-fvm-primary"></div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        لا توجد مطاعم مسجلة بعد. قم بإضافة مطعم جديد.
      </div>
    );
  }

  return (
    <>
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
                {new Date(restaurant.registrationDate).toLocaleDateString('ar-SA')}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  نشط
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/restaurants/${restaurant.id}/credentials`)}
                    className="flex items-center gap-1"
                  >
                    <Key className="h-4 w-4" />
                    <span>بيانات الدخول</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditRestaurant(restaurant.id)}
                    className="flex items-center gap-1 text-amber-600"
                  >
                    <Edit className="h-4 w-4" />
                    <span>تعديل</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteClick(restaurant)}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>حذف</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RestaurantDeleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        restaurant={restaurantToDelete}
        onConfirm={onRestaurantDeleted}
      />
    </>
  );
};

export default RestaurantsList;
