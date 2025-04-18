
import React from 'react';
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
import { Plus } from 'lucide-react';
import RestaurantTable from '@/components/restaurants/RestaurantTable';
import DeleteRestaurantDialog from '@/components/restaurants/DeleteRestaurantDialog';
import { useRestaurants } from '@/hooks/useRestaurants';

const Restaurants = () => {
  const navigate = useNavigate();
  const {
    restaurants,
    isLoading,
    deleteDialogOpen,
    restaurantToDelete,
    setDeleteDialogOpen,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useRestaurants();

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
            <RestaurantTable 
              restaurants={restaurants}
              onDeleteClick={handleDeleteClick}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <DeleteRestaurantDialog
          restaurant={restaurantToDelete}
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
};

export default Restaurants;
