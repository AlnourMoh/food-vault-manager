
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import RestaurantsHeader from '@/components/restaurant/RestaurantsHeader';
import RestaurantsList from '@/components/restaurant/RestaurantsList';
import { useRestaurants } from '@/hooks/restaurants/useRestaurants';

const Restaurants = () => {
  const { restaurants, isLoading, refreshRestaurants } = useRestaurants();

  return (
    <MainLayout>
      <div className="rtl space-y-6">
        <RestaurantsHeader />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">قائمة المطاعم</CardTitle>
            <CardDescription>قائمة بجميع المطاعم المسجلة في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <RestaurantsList 
              restaurants={restaurants} 
              isLoading={isLoading}
              onRestaurantDeleted={refreshRestaurants}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Restaurants;
