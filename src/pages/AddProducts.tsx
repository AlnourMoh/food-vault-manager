
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RestaurantLayout from '@/components/layout/RestaurantLayout';
import { Button } from '@/components/ui/button';
import { BarcodeIcon } from 'lucide-react';
import ScanProductDialog from '@/components/products/ScanProductDialog';
import { useNavigate } from 'react-router-dom';

const AddProducts = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();
  const isRestaurantRoute = window.location.pathname.startsWith('/restaurant/');
  const Layout = isRestaurantRoute ? RestaurantLayout : MainLayout;

  const handleProductAdded = () => {
    // Redirect to inventory after successful scan
    navigate(isRestaurantRoute ? '/restaurant/inventory' : '/inventory');
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-bold">إضافة منتج جديد</h1>
          <p className="text-muted-foreground">
            قم بمسح الباركود الموجود على المنتج لإضافته إلى المخزون
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setScannerOpen(true)}
            className="w-full gap-2"
          >
            <BarcodeIcon className="w-5 h-5" />
            مسح باركود المنتج
          </Button>
        </div>

        <ScanProductDialog
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onProductAdded={handleProductAdded}
        />
      </div>
    </Layout>
  );
};

export default AddProducts;
